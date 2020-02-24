from bs4 import BeautifulSoup
from urllib3.exceptions import InsecureRequestWarning
import urllib3
from search.models import Member
from search.scripts.blogRegister import support

'''
description about this method
'bc', 'ttl', 'pd' and 'mem' are boolean values.
If you want blog_ct, you hove to substitute True for 'bc'.
bc stands for blog_ct.
ttl stands for tittle.
pd stands for post_date.
mem stands for member.
Only True items will be returned.
'''


def parse_blog(group_id, blog, bc, ttl, pd, mem):
    parsed_data = []

    if bc:
        if group_id == 1:
            bottomul_tag = blog.select_one('div.box-bottom ul')
            bottomli_tags = bottomul_tag.select('li')
            blog_url = bottomli_tags[1].find('a').get('href')
        elif group_id == 2:
            blog_url = blog.select_one('div.p-button__blog_detail').find('a').get('href')
        blog_ct = support.extractBlog_ct(blog_url)
        parsed_data.append(blog_ct)

    if ttl:
        if group_id == 1:
            title_tag = blog.select_one('h3 > a')
        elif group_id == 2:
            title_tag = blog.select_one('div.c-blog-article__title')
        title = support.clean_text(title_tag.text)
        parsed_data.append(title)

    if pd:
        if group_id == 1:
            bottomul_tag = blog.select_one('div.box-bottom ul')
            bottomli_tags = bottomul_tag.select('li')
            postdate_tag = bottomli_tags[0]
        elif group_id == 2:
            postdate_tag = blog.select_one('div.p-blog-article__info > div.c-blog-article__date')
        post_date = support.convert_datetime(postdate_tag.text, group_id=group_id)
        parsed_data.append(post_date)

    if mem:
        if group_id == 1:
            writer_name_origin = blog.select_one('div.box-ttl > p.name').text
        elif group_id == 2:
            writer_name_origin = blog.select_one('div.p-blog-article__info > div.c-blog-article__name').text
        writer_name = support.clean_text(writer_name_origin)
        member = Member.objects.get(belonging_group__group_id=group_id, full_kanji=writer_name)
        parsed_data.append(member)

    if len(parsed_data) > 1:
        return tuple(parsed_data)
    else:
        return parsed_data[0]


def extract_blogs(group_id, page):
    base_url = ''
    blogs = None

    if group_id == 1:
        base_url = 'https://www.keyakizaka46.com/s/k46o/diary/member/list?ima=0000&page='
    elif group_id == 2:
        base_url = 'https://www.hinatazaka46.com/s/official/diary/member/list?ima=0000&page='
    urllib3.disable_warnings(InsecureRequestWarning)
    http = urllib3.PoolManager()

    url = base_url + str(page)
    r = http.request('GET', url)
    soup = BeautifulSoup(r.data, 'html.parser')

    if group_id == 1:
        blogs = soup.select('article')
    elif group_id == 2:
        blogs = soup.select('div.p-blog-article')

    return blogs