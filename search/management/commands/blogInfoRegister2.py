from datetime import datetime
import os
from urllib.parse import urlparse
from django.core.management.base import BaseCommand
from django.db.models import Q
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


def datetimeConverter(datetime_text):
    new_datetime_text = ' '.join(datetime_text.split())
    dt = datetime.strptime(new_datetime_text, '%Y/%m/%d %H:%M')
    return make_aware(dt)


class Command(BaseCommand):
    help = 'register blog information by scrayping.'

    def handle(self, *args, **options):
        with open('static/courpus/test.html', encoding="utf-8_sig") as f:
            html = f.read()
        f.close()
        soup = BeautifulSoup(html)

        blogs = soup.select('article')

        for blog in blogs:
            title_tag = blog.select_one('h3 > a')
            if textCleaner(title_tag.text) == '🍧欅共和国2019開催決定🍉':
                print(len(blogs))
                continue
            bottomul_tag = blog.select_one('div.box-bottom > ul')
            bottomli_tags = bottomul_tag.select('li')
            postdate_tag = bottomli_tags[0]
            blog_url = bottomli_tags[1].find('a').get('href')

            if not Blog.objects.filter(blog_ct=extractBlog_ct(blog_url)).exists():
                Blog.objects.create(
                    blog_ct=extractBlog_ct(blog_url),
                    title=textCleaner(title_tag.text),
                    post_date=datetimeConverter(postdate_tag.text),
                    writer=Member.objects.get(full_kana='すがいゆうか'),
                )
