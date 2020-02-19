from search.scripts.blogRegister.supportBlogRegister import *
import urllib3
from bs4 import BeautifulSoup
from urllib3.exceptions import InsecureRequestWarning
from ...models import Blog
import time


def blogRegisterByM_hinata(member, up_limit=100):
    sleep_time_pagetransition = 3

    base_url = 'https://www.hinatazaka46.com/s/official/diary/member/list?ima=0000&ct=' + member.ct + '&page='

    urllib3.disable_warnings(InsecureRequestWarning)
    http = urllib3.PoolManager()
    print('start scraping blog written by ' + member.full_kanji)
    for page in range(up_limit):
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
                    post_date=datetimeConverter(postdate_tag.text, 2),
                    writer=member,
                )
            else:
                print('kept up latest ' + member.full_kanji + '!!')
                break
        else:
            time.sleep(sleep_time_pagetransition)
            continue
        break
