import os
import shutil
from django.core.management.base import BaseCommand
import re
from config import settings
from search.models import Blog
from download.models import Image, Thumbnail
from urllib3.exceptions import InsecureRequestWarning
import urllib3
from bs4 import BeautifulSoup

from search.scripts.blogRegister.compresser import compress_img
from search.scripts.blogRegister.parser import parse_blog
import time


class Command(BaseCommand):
    help = 'test thumbnail.　サムネイルを持たないblogの個別ページにアクセスし、画像を確認したらサムネイルに登録。グループ指定可。' \
           '--localオプション指定で、範囲をローカルに指定。サムネイルがないBlogのImageを探し、一つ以上見つかればorder0のImageをサムネイルに設定。'

    def add_arguments(self, parser):
        parser.add_argument('-g', '--group', type=int, help='set groupID(1 or 2 or None). default:both')
        parser.add_argument('-l', '--local', action='store_true', help='set external. default:False')

    def handle(self, *args, **options):
        sleep_time = 3

        if options['group'] != 1 and options['group'] != 2 and options['group'] is not None:
            print('groupID', options['group'], 'is not supported.')
            quit()

        if options['group']:
            non_t_blogs = Blog.objects.filter(thumbnail=None, writer__belonging_group__group_id=options['group'])
        else:
            non_t_blogs = Blog.objects.filter(thumbnail=None)

        if options['local']:
            for blog in non_t_blogs:
                if Image.objects.filter(publisher=blog).exists():
                    img0_m_path = Image.objects.get(publisher=blog, order=0).picture # blog_images/1_12/12345/kkk.jpg
                    short_img0_m_path = re.match('blog_images/(.*)', str(img0_m_path)).group(1) # 1_12/12345/kkk.jpg
                    img0_path = img0_m_path.path # /www/var/otapick/media/blog_images/1_12/12345/kkk.jpg
                    thumbnail_m_path = os.path.join('blog_thumbnail', short_img0_m_path) # blog_thumbnail/1_12/12345/kkk.jpg
                    thumbnail_path = os.path.join(settings.MEDIA_ROOT, thumbnail_m_path) # /www/var/otapick/media/blog_thumbnail/1_12/12345/kkk.jpg
                    os.makedirs(os.path.dirname(thumbnail_path), exist_ok=True)
                    shutil.copyfile(img0_path, thumbnail_path) # copy
                    compress_img(thumbnail_path) # compress image
                    Thumbnail.objects.create(picture=thumbnail_m_path, publisher=blog) # register thumbnail
                    print('「', blog.title, '」(' + blog.writer.full_kanji + ')のサムネイルを登録しました。')

        else:
            pass # サムネイルをImageモデルで登録しようとしている。おそらく昔の仕様。いまのところ、ここは使わないので放置。
            # for blog in non_t_blogs:
            #     print('「', blog.title, '」writtern by', blog.writer.full_kanji, '(', blog.post_date, ')のサムネイルテストを開始します。')
            #     group_id = blog.writer.belonging_group.group_id
            #
            #     if group_id == 1:
            #         url = 'https://www.keyakizaka46.com/s/k46o/diary/detail/' + str(blog.blog_ct) + '?ima=0000&cd=member'
            #     elif group_id == 2:
            #         url = 'https://www.hinatazaka46.com/s/official/diary/detail/' + str(blog.blog_ct) + '?ima=0000&cd=member'
            #     urllib3.disable_warnings(InsecureRequestWarning)
            #     http = urllib3.PoolManager()
            #
            #     r = http.request('GET', url)
            #     soup = BeautifulSoup(r.data, 'lxml')
            #
            #     if group_id == 1:
            #         blog_article = soup.select_one('article')
            #     elif group_id == 2:
            #         blog_article = soup.select_one('div.p-blog-article')
            #
            #     member, media = parse_blog(group_id=group_id, blog=blog_article, bc=blog.blog_ct, ttl=False, pd=False, mem=True, med=True)
            #     if media is not None and not Image.objects.filter(order=0, publisher=blog).exists():
            #         print('サムネイルを取得できました。登録を開始します。')
            #         new_thumbnail = Image(order=0, picture=media, publisher=blog)
            #         new_thumbnail.save()
            #         blog.thumbnail = new_thumbnail
            #         blog.save()
            #         print('登録完了')
            #     elif media is None:
            #         print('画像が含まれていません。')
            #
            #     time.sleep(sleep_time)
