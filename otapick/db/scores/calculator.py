import random

from django.db.models import Max

import otapick
from image.models import Image
from main.models import Blog, Group, Member
from .evaluator import RecommendScoreEvaluator


def init_calc_recommend_score():
    """
     calc_recommend_scoreの前準備として、上位メンバー(各グループ10人の計20人)のリストと、それぞれ3つに分けたimage, blogのリストを返す。
     :return:: high_score_members, divided_blogs, divided_images
    """
    high_score_members = [] # [[欅high_score_members], [日向high_score_members]]
    len_high_score_members = 10


    for group_id in list(Group.objects.all().values_list('group_id', flat=True)):
        high_score_member_points = {} # key: メンバーid, val: point
        high_score_members_list = [] # Memberオブジェクトのみ
        high_score_blogs = Blog.objects.exclude(score=0).filter(writer__belonging_group__group_id=group_id).order_by('-score')
        high_score_images = Image.objects.exclude(score=0).filter(
                publisher__writer__belonging_group__group_id=group_id).order_by('-score')

        tiescore_mode = False # memberが10人集まった終了時、まだタイスコアが続くようであれば、処理を続行。
        blog_tie = {'score': 0, 'index': 0}
        image_tie = {'score': 0, 'index': 0}
        end = {'blog': False, 'image': False}

        for i, (high_score_blog, high_score_image) in enumerate(zip(high_score_blogs, high_score_images)):
            if high_score_blog.score == 0 and high_score_image.score == 0:
                break
            if tiescore_mode:
                if blog_tie['score'] > high_score_blog.score:
                    end['blog'] = True
                if image_tie['score'] > high_score_image.score:
                    end['image'] = True
                if blog_tie['score'] == 0 and image_tie['score'] == 0:
                    break
                if end['blog'] and end['image']:
                    break

            # 1位10point, 2位9point, ..., 10位以降1point
            if blog_tie['score'] > high_score_blog.score or i == 0:
                blog_point = len_high_score_members - i if i < len_high_score_members else 1
                blog_tie['index'] = i
            else:
                blog_point = len_high_score_members - blog_tie['index'] if blog_tie['index'] < len_high_score_members else 1
            if image_tie['score'] > high_score_image.score or i == 0:
                image_point = len_high_score_members - i if i < len_high_score_members else 1
                image_tie['index'] = i
            else:
                image_point = len_high_score_members - image_tie['index'] if image_tie['index'] < len_high_score_members else 1

            # high_score_member_pointsにpointを登録、または更新
            if str(high_score_blog.writer.id) in high_score_member_points:
                high_score_member_points[str(high_score_blog.writer.id)] += blog_point
            else:
                high_score_member_points[str(high_score_blog.writer.id)] = blog_point
            if str(high_score_image.publisher.writer.id) in high_score_member_points:
                high_score_member_points[str(high_score_image.publisher.writer.id)] += image_point
            else:
                high_score_member_points[str(high_score_image.publisher.writer.id)] = image_point

            # high_score_members_listにmemberを登録
            if not high_score_blog.writer in high_score_members_list:
                high_score_members_list.append(high_score_blog.writer)
            if not high_score_image.publisher.writer in high_score_members_list:
                high_score_members_list.append(high_score_image.publisher.writer)

            if len(high_score_members_list) >= len_high_score_members:
                if not tiescore_mode:
                    tiescore_mode = True

            blog_tie['score'] = high_score_blog.score
            image_tie['score'] = high_score_image.score

        # high_score_member_pointsのvalueで降順にソート
        high_score_member_points = sorted(high_score_member_points.items(), key=lambda x: x[1], reverse=True) # [(member_id, point), (member_id, point), ...]
        high_score_members.append([Member.objects.get(id=member[0]) for member in high_score_member_points[:len_high_score_members]])


    blogs = otapick.sort_blogs(Blog.objects.filter(writer__graduate=False), 'older_post')
    images = otapick.sort_images(Image.objects.filter(publisher__writer__graduate=False), 'older_post')

    # 3つに分ける
    blog_ids = list(blogs.values_list('id', flat=True))
    divided_blogs = [Blog.objects.filter(id__in=blog_ids[int(blogs.count() * i / 3): int(blogs.count() * (i + 1) / 3)])
                        for i in range(3)]
    image_ids = list(images.values_list('id', flat=True))
    divided_images = [Image.objects.filter(id__in=image_ids[int(images.count() * i / 3): int(images.count() * (i + 1) / 3)])
                         for i in range(3)]

    # 真ん中に卒業メンバーのblog, imageを追加
    blog_ids = list(divided_blogs[1].values_list('id', flat=True))
    blog_ids_graduate = list(Blog.objects.filter(writer__graduate=True).values_list('id', flat=True))
    divided_blogs[1] = Blog.objects.filter(id__in=blog_ids + blog_ids_graduate)

    image_ids = list(divided_images[1].values_list('id', flat=True))
    image_ids_graduate = list(Image.objects.filter(publisher__writer__graduate=True).values_list('id', flat=True))
    divided_images[1] = Image.objects.filter(id__in=image_ids + image_ids_graduate)

    return high_score_members, divided_blogs, divided_images


def calc_recommend_score(high_score_members, divided_blogs=None, divided_images=None):
    if divided_blogs is not None:
        divided_records = divided_blogs
        Model = Blog
        recommend_score_evaluator = RecommendScoreEvaluator(high_score_members, 'blog')
        mode = 'blog'
    elif divided_images is not None:
        divided_records = divided_images
        Model = Image
        recommend_score_evaluator = RecommendScoreEvaluator(high_score_members, 'image')
        mode = 'image'
    else:
        return

    ### new blogs and images ###
    # (全てのブログまたは画像を評価)
    update_record = []
    for record in divided_records[2]:
        update_record.append(recommend_score_evaluator.evaluate(record))
    print('xxxx', len(update_record))
    Model.objects.bulk_update(update_record, fields=['recommend_score'], batch_size=10000)
    random_upper_limit = divided_records[2].aggregate(Max('recommend_score'))['recommend_score__max']

    # (recommend_score0のブログまたは画像50件にボーナス)
    update_record = []
    for record in divided_records[2].filter(recommend_score=0).order_by('?')[:50]:
        diff_recommend_score = random_upper_limit - record.recommend_score
        record.recommend_score += random.uniform(0, diff_recommend_score)
        update_record.append(record)
    Model.objects.bulk_update(update_record, fields=['recommend_score'], batch_size=10000)

    ### mid blogs and images and graduate member blogs and images ###
    # (リセット)
    update_record = []
    for record in divided_records[1].exclude(recommend_score=0):
        record.recommend_score = 0
        update_record.append(record)
    Model.objects.bulk_update(update_record, fields=['recommend_score'], batch_size=10000)

    # (score > 0のblogまたはimageを評価)
    update_record = []
    for record in divided_records[1].exclude(score=0):
        update_record.append(recommend_score_evaluator.evaluate(record))
    Model.objects.bulk_update(update_record, fields=['recommend_score'], batch_size=10000)

    # (上位メンバーのブログまたは画像各5件)
    update_record = []
    for high_score_members_by_G in high_score_members:
        for member in high_score_members_by_G:
            if mode == 'blog':
                records = divided_records[1].filter(writer=member, recommend_score=0).order_by('?')[:5]
            elif mode == 'image':
                records = divided_records[1].filter(publisher__writer=member, recommend_score=0).order_by('?')[:5]
            else: records = None
            for record in records:
                record.recommend_score = random.uniform(4, random_upper_limit)
                update_record.append(record)
    Model.objects.bulk_update(update_record, fields=['recommend_score'], batch_size=10000)

    # (他20件)
    update_record = []
    for record in divided_records[1].filter(recommend_score=0).order_by('?')[:20]:
        record.recommend_score = random.uniform(4, random_upper_limit)
        update_record.append(record)
    Model.objects.bulk_update(update_record, fields=['recommend_score'], batch_size=10000)

    ### old blogs and images ###
    # (リセット)
    update_record = []
    for record in divided_records[0].exclude(recommend_score=0):
        record.recommend_score = 0
        update_record.append(record)
    Model.objects.bulk_update(update_record, fields=['recommend_score'], batch_size=10000)

    # (score上位10件)
    update_record = []
    for record in divided_records[0].exclude(score=0).order_by('-score')[:10]:
        record.recommend_score = random.uniform(5, random_upper_limit)
        update_record.append(record)
    Model.objects.bulk_update(update_record, fields=['recommend_score'], batch_size=10000)

    # (上位メンバーのブログまたは画像各2件)
    update_record = []
    for high_score_members_by_G in high_score_members:
        for member in high_score_members_by_G:
            if mode == 'blog':
                records = divided_records[0].filter(writer=member, recommend_score=0).order_by('?')[:2]
            elif mode == 'image':
                records = divided_records[0].filter(publisher__writer=member, recommend_score=0).order_by('?')[:2]
            else: records = None
            for record in records:
                record.recommend_score = random.uniform(4, random_upper_limit)
                update_record.append(record)
    Model.objects.bulk_update(update_record, fields=['recommend_score'], batch_size=10000)

    # (他10件)
    update_record = []
    for record in divided_records[0].filter(recommend_score=0).order_by('?')[:10]:
        record.recommend_score = random.uniform(4, random_upper_limit)
        update_record.append(record)
    Model.objects.bulk_update(update_record, fields=['recommend_score'], batch_size=10000)


def calc_score(blogs=None, images=None):
    """
    blogかimageを渡して、scoreを計算。
    [blog]
        num_of_views, num_of_downloadsなどの変更があったblogのみ処理する(blog.changed参照)。
        評価式：
            score = 閲覧数(1日目) * 3 + 閲覧数(2日目) * 2 + 閲覧数(3日目) + 画像の最大ダウンロード数(1日) * 3
    [image]
        num_of_views, num_of_downloadsなどの変更があったimageのみ処理する(image.changed参照)。
        評価式：
            score = 閲覧数(1日目) * 3 + 閲覧数(2日目) * 2 + 閲覧数(3日目) + ダウンロード数(1日) * 3
    """
    if blogs is not None:
        target_blogs = blogs.filter(changed=True)
        for blog in target_blogs:
            max_d1_per_day = 0
            if Image.objects.filter(publisher=blog).exists():
                max_d1_per_day = Image.objects.filter(publisher=blog).order_by('-d1_per_day')[0].d1_per_day
            score = blog.v1_per_day * 3 + blog.v2_per_day * 2 + blog.v3_per_day + max_d1_per_day * 3
            blog.score = score
            blog.changed = False
            blog.save()

    elif images is not None:
        target_images = images.filter(changed=True)
        for image in target_images:
            score = image.v1_per_day * 3 + image.v2_per_day * 2 + image.v3_per_day + image.d1_per_day * 3
            image.score = score
            image.changed = False
            image.save()
