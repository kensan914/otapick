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
    dt = datetime.strptime(new_datetime_text, '%Y/%m/%d %H:%M')
    return make_aware(dt)


def blogRegisterByM_keyaki(member, allCheck):
    upLimit = 100
    sleepTime_pagetransition = 3

    base_url = 'http://www.keyakizaka46.com/s/k46o/diary/member/list?ima=0000&ct=' + member.ct + '&page='

    urllib3.disable_warnings(InsecureRequestWarning)
    http = urllib3.PoolManager()
    print('start scraping blog written by ' + member.full_kanji)
    for page in range(upLimit):
        print('now scraping page', page + 1, '...')

        url = base_url + str(page)
        r = http.request('GET', url)
        soup = BeautifulSoup(r.data, 'lxml')
        blogs = soup.select('article')
        if not bool(blogs):
            print("finished!!")
            break

        for blog in blogs:
            bottomul_tag = blog.select_one('div.box-bottom ul')
            bottomli_tags = bottomul_tag.select('li')
            blog_url = bottomli_tags[1].find('a').get('href')

            if not Blog.objects.filter(blog_ct=extractBlog_ct(blog_url),
                                       writer__belonging_group__group_id=1).exists():
                title_tag = blog.select_one('h3 > a')
                title = textCleaner(title_tag.text)
                postdate_tag = bottomli_tags[0]
                Blog.objects.create(
                    blog_ct=extractBlog_ct(blog_url),
                    title=title,
                    post_date=datetimeConverter(postdate_tag.text),
                    writer=member,
                )
            else:
                if not allCheck:
                    print('kept up latest ' + member.full_kanji + '!!')
                    break
        else:
            time.sleep(sleepTime_pagetransition)
            continue
        if not allCheck:
            break


class Command(BaseCommand):
    help = 'register keyaki blog information by scrayping.'

    def handle(self, *args, **options):
        sleepTime_membertransition = 1

        for member in Member.objects.filter(belonging_group__group_id=1):
            blogRegisterByM_keyaki(member, allCheck=False)
            time.sleep(sleepTime_membertransition)