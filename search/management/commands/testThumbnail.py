from django.core.management.base import BaseCommand
from search.scripts.blogRegister.registerer import register_latest
from search.models import Blog
from download.models import Image
from urllib3.exceptions import InsecureRequestWarning
import urllib3
from bs4 import BeautifulSoup
from search.scripts.blogRegister.parser import parse_blog
import time


class Command(BaseCommand):
    help = 'test thumbnail.'

    def add_arguments(self, parser):
        parser.add_argument('-g', '--group', type=int, help='set groupID(1 or 2 or None). default:both')

    def handle(self, *args, **options):
        sleep_time = 3

        if options['group'] != 1 and options['group'] != 2 and options['group'] is not None:
            print('groupID', options['group'], 'is not supported.')
            quit()

        if options['group']:
            non_t_blogs = Blog.objects.filter(thumbnail=None, writer__belonging_group__group_id=options['group'])
        else:
            non_t_blogs = Blog.objects.filter(thumbnail=None)

        for blog in non_t_blogs:
            print('「', blog.title, '」writtern by', blog.writer.full_kanji, 'のサムネイルテストを開始します。')
            group_id = blog.writer.belonging_group.group_id

            if group_id == 1:
                url = 'https://www.keyakizaka46.com/s/k46o/diary/detail/' + blog.blog_ct + '?ima=0000&cd=member'
            elif group_id == 2:
                url = 'https://www.hinatazaka46.com/s/official/diary/detail/' + blog.blog_ct + '?ima=0000&cd=member'
            urllib3.disable_warnings(InsecureRequestWarning)
            http = urllib3.PoolManager()

            r = http.request('GET', url)
            soup = BeautifulSoup(r.data, 'lxml')

            if group_id == 1:
                blog_article = soup.find('article')
            elif group_id == 2:
                blog_article = soup.find('div.p-blog-article')

            blog_ct, member, media = parse_blog(group_id=group_id, blog=blog_article, bc=True, ttl=False, pd=False,
                                                mem=True, med=True)
            if media is not None and not Image.objects.filter(order=0, publisher=blog).exists():
                print('サムネイルを取得できました。登録を開始します。')
                new_thumbnail = Image(order=0, picture=media, publisher=blog)
                new_thumbnail.save()
                blog.thumbnail = new_thumbnail
                blog.save()
                print('登録完了')
            elif media is None:
                print('￿画像が含まれません。')

            time.sleep(sleep_time)
