from search.scripts.blogRegister.supportBlogRegister import *
import urllib3
from bs4 import BeautifulSoup
from urllib3.exceptions import InsecureRequestWarning
from ...models import Blog
import time


def blogRegisterByM_keyaki(member, all_check, up_limit=100):
    sleep_time_pagetransition = 3

    base_url = 'http://www.keyakizaka46.com/s/k46o/diary/member/list?ima=0000&ct=' + member.ct + '&page='

    urllib3.disable_warnings(InsecureRequestWarning)
    http = urllib3.PoolManager()
    print('start scraping blog written by ' + member.full_kanji)
    for page in range(up_limit):
        print('now scraping page', page + 1, '...')

        url = base_url + str(page)
        r = http.request('GET', url)
        soup = BeautifulSoup(r.data, 'html.parser')
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
                    post_date=datetimeConverter(postdate_tag.text, 1),
                    writer=member,
                )
            else:
                if not all_check:
                    print('kept up latest ' + member.full_kanji + '!!')
                    break
        else:
            time.sleep(sleep_time_pagetransition)
            continue
        if not all_check:
            break

