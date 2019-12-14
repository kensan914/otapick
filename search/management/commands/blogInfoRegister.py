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


class Command(BaseCommand):
    help = 'register blog information by scrayping.'

    def handle(self, *args, **options):
        sleepTime = 3
        upLimit = 100

        for member in Member.objects.filter(ct='12', belonging_group__group_id=1):
            if member.belonging_group__group_id == 1:
                base_url = 'http://www.keyakizaka46.com/s/k46o/diary/member/list?ima=0000&ct=' + member.ct + '&page='
            else:
                base_url = 'https://www.hinatazaka46.com/s/official/diary/member/list?ima=0000&ct=' + member.ct + '&page='

            urllib3.disable_warnings(InsecureRequestWarning)
            http = urllib3.PoolManager()
            print('start scraping blog written by ' + member.full_kanji)
            for page in range(upLimit):
                print('now scraping page', page + 1, '...')

                url = base_url + str(page)
                r = http.request('GET', url)
                soup = BeautifulSoup(r.data, 'html.parser')

                blogs = soup.select('article')
                if not bool(blogs):
                    print("finished!!")
                    break

                for blog in blogs:
                    title_tag = blog.select_one('h3 > a')
                    bottomul_tag = blog.select_one('div.box-bottom > ul')
                    bottomli_tags = bottomul_tag.select('li')
                    postdate_tag = bottomli_tags[0]
                    blog_url = bottomli_tags[1].find('a').get('href')

                    if not Blog.objects.filter(blog_ct=self.extractBlog_ct(blog_url)).exists():
                        Blog.objects.create(
                            blog_ct=self.extractBlog_ct(blog_url),
                            title=self.textCleaner(title_tag.text),
                            post_date=self.datetimeConverter(postdate_tag.text),
                            writer=member,
                        )

                time.sleep(sleepTime)

    def textCleaner(self, text):
        text = text.replace('\n', '')
        text = text.replace(' ', '')
        text = text.replace('\t', '')
        return text

    def extractBlog_ct(self, url):
        o = urlparse(url)
        return int(os.path.basename(o.path))

    def datetimeConverter(self, datetime_text):
        new_datetime_text = ' '.join(datetime_text.split())
        dt = datetime.strptime(new_datetime_text, '%Y/%m/%d %H:%M')
        return make_aware(dt)


