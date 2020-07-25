import math
import random
import numpy as np
from django.db.models import Q
import otapick
from api.serializers import ImageSerializer, BlogSerializer, MemberSerializer
from image.models import Image
from otapick.db import blog
from main.models import Group, Blog, Member


class ListInfo:
    def __init__(self, group_id, ct, order_format):
        self.group_id = group_id
        self.ct = ct
        self.order_format = order_format
        self.title = ''
        self.num_of_hit = 0
        self.meta_title = ''


class BlogListInfo(ListInfo):
    def __init__(self, group_id, ct, order_format, narrowing_keyword, narrowing_post):
        super().__init__(group_id, ct, order_format)
        self.narrowing_keyword = narrowing_keyword
        self.narrowing_post = narrowing_post

    def get_result(self):
        if self.group_id is None:
            self.title = "おすすめ"
            self.meta_title = "欅坂46・日向坂46のおすすめ"
            narrowing_blogs = Blog.objects.all()
        elif self.ct is None:
            if Group.objects.filter(group_id=self.group_id).exists():
                group_name = Group.objects.get(group_id=self.group_id).name
                self.title = group_name
                self.meta_title = group_name
            else:
                return {'status': 'not_found_group'}
            narrowing_blogs = Blog.objects.filter(writer__belonging_group__group_id=self.group_id)
        else:
            if Member.objects.filter(belonging_group__group_id=self.group_id, ct=self.ct).exists():
                member = Member.objects.get(belonging_group__group_id=self.group_id, ct=self.ct)
                self.title = member.full_kanji
                self.meta_title = '{}({})'.format(member.full_kanji, member.belonging_group.name)
            else:
                return {'status': 'not_found_member'}
            narrowing_blogs = Blog.objects.filter(writer__belonging_group__group_id=self.group_id, writer__ct=self.ct)
        narrowing_blogs = blog.narrowdown_blogs_keyword(narrowing_blogs, self.narrowing_keyword)
        narrowing_blogs = blog.narrowdown_blogs_post(narrowing_blogs, self.narrowing_post)
        self.num_of_hit = narrowing_blogs.count()
        return {'title': self.title, 'num_of_hit': self.num_of_hit, 'meta_title': self.meta_title}


class ImageListInfo(ListInfo):
    def get_result(self):
        if self.group_id == 0:
            self.title = "ホーム"
            self.meta_title = "欅坂46・日向坂46のブログ画像を保存するなら"
            images = Image.objects.all()
        elif self.group_id is None:
            self.title = "おすすめ"
            self.meta_title = "欅坂46・日向坂46のおすすめ"
            images = Image.objects.all()
        elif self.ct is None:
            if Group.objects.filter(group_id=self.group_id).exists():
                group_name = Group.objects.get(group_id=self.group_id).name
                self.title = group_name
                self.meta_title = group_name
            else:
                return {'status': 'not_found_group'}
            images = Image.objects.filter(publisher__writer__belonging_group__group_id=self.group_id)
        else:
            if Member.objects.filter(belonging_group__group_id=self.group_id, ct=self.ct).exists():
                member = Member.objects.get(belonging_group__group_id=self.group_id, ct=self.ct)
                self.title = member.full_kanji
                self.meta_title = '{}({})'.format(member.full_kanji, member.belonging_group.name)
            else:
                return {'status': 'not_found_member'}
            images = Image.objects.filter(publisher__writer__belonging_group__group_id=self.group_id, publisher__writer__ct=self.ct)
        self.num_of_hit = images.count()
        return {'title': self.title, 'num_of_hit': self.num_of_hit, 'meta_title': self.meta_title}


def sort_by_recommend_score(queryset, page, random_seed, paginate_by):
    """
    blogs と　images をrecommend_scoreの降順にソート
    :return: 長さpaginate_byのクエリオブジェクトのidリスト(ソート済)
    """
    q_group_capacity = 3
    q_group_len = paginate_by * q_group_capacity # 1グループの長さ。 ex) 20 * 3 = 60
    q_group_num = math.floor((paginate_by * (page - 1)) / q_group_len) # どのグループに属しているか(0, 1, 2, ...)
    q_group_index =  (page - 1) % q_group_capacity # グループ内のインデックス(0, 1, 2, ...)

    queryset = queryset.order_by('-recommend_score', '-score')
    queryset_parts = queryset[q_group_len * q_group_num: q_group_len * (q_group_num + 1)]

    np.random.seed(random_seed)
    id_list = list(queryset_parts.values_list('id', flat=True)) # クエリセットのidのリスト
    np.random.shuffle(id_list)
    selected_id_list = id_list[paginate_by * q_group_index: paginate_by * (q_group_index + 1)] # id_listからランダムに選んだ20個の整数リスト

    return selected_id_list


def sort_images_by_related(blog, order, page, paginate_by):
    post_month_score = blog.post_date.year * 12 + blog.post_date.month  # post_dateを月だけで表現 ex) 2019年9月 => 2019*12 + 9 = 24237
    last_post_year, last_post_month = divmod(post_month_score - 1, 12) # 投稿日の前月の年, 投稿日の前月の月
    next_post_year, next_post_month = divmod(post_month_score + 1, 12) # 投稿日の次月の年, 投稿日の次月の月
    if last_post_month == 0: # 前月、次月が12月の場合
        last_post_year -= 1
        last_post_month = 12
    elif next_post_month == 0:
        next_post_year -= 1
        next_post_month = 12

    id_list = list(Image.objects.filter(publisher=blog).exclude(order=order).values_list('id', flat=True))
    base_images = Image.objects.exclude(publisher=blog)

    # 当月
    images = base_images.filter(publisher__writer=blog.writer, publisher__post_date__year=blog.post_date.year,
                                publisher__post_date__month=blog.post_date.month).order_by('-recommend_score', '-score')

    if images.exists():
        id_list += list(images.values_list('id', flat=True))

    # 前月 or 次月
    images = base_images.exclude(id__in=id_list).filter(Q(publisher__writer=blog.writer, publisher__post_date__year=last_post_year, publisher__post_date__month=last_post_month)
                           | Q(publisher__writer=blog.writer, publisher__post_date__year=next_post_year, publisher__post_date__month=next_post_month)).order_by('-recommend_score', '-score')

    if images.exists():
        id_list += list(images.values_list('id', flat=True))

    # 該当メンバーその他
    images = base_images.exclude(id__in=id_list).filter(publisher__writer=blog.writer).order_by('-recommend_score', '-score')

    if images.exists():
        id_list += list(images.values_list('id', flat=True))

    # others
    images = base_images.exclude(id__in=id_list).order_by('-recommend_score', '-score')
    if images.exists():
        id_list += list(images.values_list('id', flat=True))

    selected_id_list = id_list[paginate_by * (page - 1): paginate_by * page]

    # 1ページ(len20)シャッフル
    random.shuffle(selected_id_list)
    return selected_id_list


def generate_resource_data(resources, max_rank, rank_type, resource_type, prefix, modifier, suffix, group_name):
    """
    rank_type: 'dl" or 'view' or 'popularity'
    resource_type: 'image' or 'blog'
    :return: {'resource': image or blog, 'resource_info': {'type': 'image or blog', 'message', '...'}}
    """
    resources_data = []
    if len(resources) >= max_rank:
        for rank in range(max_rank):
            if rank == 0:
                comparison = '最も'
            else:
                comparison = str(rank + 1) + '番目に'
            message = prefix[rank_type] + comparison + modifier[rank_type] + suffix[resource_type] + '({})'.format(group_name)
            resources_data.append({'resource': resources[rank], 'resource_info': {'type': resource_type, 'message': message}})
    else:
        return []
    return resources_data


def get_additional_data(random_seed):
    data = []
    data_length = 50
    max_rank = 3
    prefix = {'dl': '今日', 'view': '今日', 'popularity': '現在', 'newer': '現在'}
    modifier = {'dl': 'ダウンロードされた', 'view': '閲覧された', 'popularity': '人気のある', 'newer': '新しい'}
    suffix = {'image': '画像', 'blog': 'ブログ'}

    for group in Group.objects.all():
        # images
        images = Image.objects.filter(publisher__writer__belonging_group=group)
        most_dl_per_day_images = images.exclude(d1_per_day=0).order_by('-d1_per_day')
        most_view_per_day_images = images.exclude(v1_per_day=0).order_by('-v1_per_day')
        most_popular_images = images.exclude(score=0).order_by('-score')

        images_data = []
        images_data.extend(generate_resource_data(most_dl_per_day_images, max_rank, 'dl', 'image', prefix, modifier, suffix, group.name))
        images_data.extend(generate_resource_data(most_view_per_day_images, max_rank, 'view', 'image', prefix, modifier, suffix, group.name))
        # 注目メンバー決定のため↓
        images_data_p = generate_resource_data(most_popular_images, max_rank, 'popularity', 'image', prefix, modifier, suffix, group.name)
        if images_data_p: most_popular_image = images_data_p[0]['resource']
        else: most_popular_image = None
        images_data.extend(images_data_p)

        for i, images_data_part in enumerate(images_data):
            if images_data_part is not None:
                image_data = ImageSerializer(images_data_part['resource']).data
                blog_data = BlogSerializer(images_data_part['resource'].publisher).data
                images_data_part['resource_info'].update({'image': image_data, 'blog': blog_data})
                data.append(images_data_part['resource_info'])

        # blogs
        blogs = Blog.objects.filter(writer__belonging_group=group)
        most_view_per_day_blogs = blogs.exclude(v1_per_day=0).order_by('-v1_per_day')
        newest_blogs = otapick.sort_blogs(blogs, 'newer_post')
        most_popular_blogs = blogs.exclude(score=0).order_by('-score')

        blogs_data = []
        blogs_data.extend(generate_resource_data(most_view_per_day_blogs, max_rank, 'view', 'blog', prefix, modifier, suffix, group.name))
        blogs_data.extend(generate_resource_data(newest_blogs, max_rank, 'newer', 'blog', prefix, modifier, suffix, group.name))
        # 注目メンバー決定のため↓
        blogs_data_p = generate_resource_data(most_popular_blogs, max_rank, 'popularity', 'blog', prefix, modifier, suffix, group.name)
        if blogs_data_p: most_popular_blog = blogs_data_p[0]['resource']
        else: most_popular_blog = None
        blogs_data.extend(blogs_data_p)

        for i, blogs_data_part in enumerate(blogs_data):
            if blogs_data_part is not None:
                blog_data = BlogSerializer(blogs_data_part['resource']).data
                blogs_data_part['resource_info'].update({'blog': blog_data})
                data.append(blogs_data_part['resource_info'])

        # member
        if most_popular_image is not None:
            popular_member = most_popular_image.publisher.writer
        elif most_popular_blog is not None:
            popular_member = most_popular_blog.writer
        else:
            popular_member = None

        if popular_member is not None:
            member_data = MemberSerializer(popular_member).data
            member_data = {'member': member_data}
            member_data.update({'type': 'member', 'message': '注目のメンバー({})'.format(group.name)})
            data.append(member_data)

    data += [None for _ in range(data_length - len(data))]
    np.random.seed(random_seed)
    np.random.shuffle(data)

    return data
