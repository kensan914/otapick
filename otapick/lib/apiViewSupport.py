import math
import random
import time

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


def generate_images_data(images):
    images_data = ImageSerializer(images, many=True).data
    blogs = [image.publisher for image in images]
    blogs_data = BlogSerializer(blogs, many=True).data
    data = []
    for image_data, blog_data in zip(images_data, blogs_data):
        data.append({'image': image_data, 'blog': blog_data})
    return data


def get_additional_data(random_seed):
    data = []
    data_length = 30

    for group in Group.objects.all():
        # images
        images = Image.objects.filter(publisher__writer__belonging_group=group)
        most_dl_per_day_image = images.exclude(d1_per_day=0).order_by('-d1_per_day')[0]
        most_view_per_day_image = images.exclude(v1_per_day=0).order_by('-v1_per_day')[0]
        most_popular_image = images.exclude(score=0).order_by('-score')[0]

        images_data = generate_images_data([most_dl_per_day_image, most_view_per_day_image, most_popular_image])
        images_data[0].update({'type': 'image', 'message': '今日最もダウンロードされた画像({})'.format(group.name)})
        images_data[1].update({'type': 'image', 'message': '今日最も閲覧された画像({})'.format(group.name)})
        images_data[2].update({'type': 'image', 'message': '現在最も人気のある画像({})'.format(group.name)})
        data += images_data

        # blogs
        blogs = Blog.objects.filter(writer__belonging_group=group)
        most_view_per_day_blog = blogs.exclude(v1_per_day=0).order_by('-v1_per_day')[0]
        most_popular_blog = blogs.exclude(score=0).order_by('-score')[0]
        newest_blog = otapick.sort_blogs(blogs, 'newer_post')[0]

        blogs_data = BlogSerializer([most_view_per_day_blog, most_popular_blog, newest_blog], many=True).data
        blogs_data = [{'blog': blog_data} for blog_data in blogs_data ]

        blogs_data[0].update({'type': 'blog', 'message': '今日最も閲覧されたブログ({})'.format(group.name)})
        blogs_data[1].update({'type': 'blog', 'message': '現在最も人気のあるブログ({})'.format(group.name)})
        blogs_data[2].update({'type': 'blog', 'message': '最新のブログ({})'.format(group.name)})
        data += blogs_data

        # member
        popular_member = most_popular_blog.writer
        member_data = MemberSerializer(popular_member).data
        member_data = {'member': member_data}
        member_data.update({'type': 'member', 'message': '注目のメンバー({})'.format(group.name)})
        data.append(member_data)

    data += [None for i in range(data_length - len(data))]
    np.random.seed(random_seed)
    np.random.shuffle(data)

    return data
