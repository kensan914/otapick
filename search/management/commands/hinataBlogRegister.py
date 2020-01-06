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


def datetimeConverter(datetime_text):
    new_datetime_text = ' '.join(datetime_text.split())
    dt = datetime.strptime(new_datetime_text, '%Y.%m.%d %H:%M')
    return make_aware(dt)


def blogRegisterByM_hinata(member):
    upLimit = 100
    sleepTime_pagetransition = 3

    base_url = 'https://www.hinatazaka46.com/s/official/diary/member/list?ima=0000&ct=' + member.ct + '&page='

    urllib3.disable_warnings(InsecureRequestWarning)
    http = urllib3.PoolManager()
    print('start scraping blog written by ' + member.full_kanji)
    for page in range(upLimit):
        print('now scraping page', page + 1, '...')

        url = base_url + str(page)
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
                Blog.objects.create(
                    blog_ct=extractBlog_ct(blog_url),
                    title=title,
                    post_date=datetimeConverter(postdate_tag.text),
                    writer=member,
                )
            else:
                print('kept up latest ' + member.full_kanji + '!!')
                break
        else:
            time.sleep(sleepTime_pagetransition)
            continue
        break


class Command(BaseCommand):
    help = 'register hinata blog information by scrayping.'

    def handle(self, *args, **options):
        sleepTime_membertransition = 1

        for member in Member.objects.filter(belonging_group__group_id=2):
            blogRegisterByM_hinata(member)
            time.sleep(sleepTime_membertransition)
