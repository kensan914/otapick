from datetime import datetime
import os
from urllib.parse import urlparse
from django.core.management.base import BaseCommand
from ...models import Member, Blog
import urllib3
from bs4 import BeautifulSoup
import time
from urllib3.exceptions import InsecureRequestWarning
from django.utils.timezone import make_aware


def textCleaner(text):
    text = text.replace('\n', '')
    text = text.replace(' ', '')
    text = text.replace('\t', '')
    return text


def extractBlog_ct(url):
    o = urlparse(url)
    return int(os.path.basename(o.path))


def datetimeConverter(datetime_text, group_id):
    new_datetime_text = ' '.join(datetime_text.split())
    if group_id == 1:
        dt = datetime.strptime(new_datetime_text, '%Y/%m/%d %H:%M')
    elif group_id == 2:
        dt = datetime.strptime(new_datetime_text, '%Y.%m.%d %H:%M')
    else:
        dt = None
    return make_aware(dt)


class Command(BaseCommand):
    help = 'keep up latest blog information by scrayping.'

    def handle(self, *args, **options):
        sleepTime = 3
        upLimit = 100

        keyaki_url_l = 'https://www.keyakizaka46.com/s/k46o/diary/member/list?ima=0000&page='
        urllib3.disable_warnings(InsecureRequestWarning)
        http = urllib3.PoolManager()
        for page in range(upLimit):
            url = keyaki_url_l + str(page)
            r = http.request('GET', url)
            soup = BeautifulSoup(r.data, 'html.parser')

            blogs = soup.select('article')
            if not bool(blogs):
                print("finished!!")
                break
            for blog in blogs:
                bottomul_tag = blog.select_one('div.box-bottom > ul')
                bottomli_tags = bottomul_tag.select('li')
                blog_url = bottomli_tags[1].find('a').get('href')
                if not Blog.objects.filter(blog_ct=extractBlog_ct(blog_url), writer__belonging_group__group_id=1).exists():
                    title_tag = blog.select_one('h3 > a')
                    title = textCleaner(title_tag.text)
                    postdate_tag = bottomli_tags[0]
                    writer_name_origin = blog.select_one('div.box-ttl > p.name').text
                    writer_name = textCleaner(writer_name_origin)
                    print('register 「' + title + '」 written by ' + writer_name)
                    Blog.objects.create(
                        blog_ct=extractBlog_ct(blog_url),
                        title=title,
                        post_date=datetimeConverter(postdate_tag.text, 1),
                        writer=Member.objects.get(belonging_group__group_id=1, full_kanji=writer_name),
                    )
                else:
                    print('kept up latest!!')
                    break
            else:
                time.sleep(sleepTime)
                print('go next page.')
                continue
            break

        hinata_url_l = 'https://www.hinatazaka46.com/s/official/diary/member/list?ima=0000&page='
        urllib3.disable_warnings(InsecureRequestWarning)
        http = urllib3.PoolManager()
        for page in range(upLimit):
            url = hinata_url_l + str(page)
            r = http.request('GET', url)
            soup = BeautifulSoup(r.data, 'html.parser')

            blogs = soup.select('div.p-blog-article')
            if not bool(blogs):
                print("finished!!")
                break
            for blog in blogs:
                blog_url = blog.select_one('div.p-button__blog_detail').find('a').get('href')
                if not Blog.objects.filter(blog_ct=extractBlog_ct(blog_url),
                                           writer__belonging_group__group_id=2).exists():
                    title_tag = blog.select_one('div.c-blog-article__title')
                    title = textCleaner(title_tag.text)
                    postdate_tag = blog.select_one('div.p-blog-article__info > div.c-blog-article__date')
                    writer_name_origin = blog.select_one('div.p-blog-article__info > div.c-blog-article__name').text
                    writer_name = textCleaner(writer_name_origin)
                    Blog.objects.create(
                        blog_ct=extractBlog_ct(blog_url),
                        title=title,
                        post_date=datetimeConverter(postdate_tag.text, 2),
                        writer=Member.objects.get(belonging_group__group_id=2, full_kanji=writer_name),
                    )
                    print('register 「' + title + '」 written by ' + writer_name)
                else:
                    print('kept up latest!!')
                    break
            else:
                time.sleep(sleepTime)
                print('go next page.')
                continue
            break
