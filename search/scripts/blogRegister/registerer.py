from search.scripts.blogRegister import support
import urllib3
from bs4 import BeautifulSoup
from urllib3.exceptions import InsecureRequestWarning
import time
from search.scripts.blogRegister import hinata
from search.scripts.blogRegister import keyaki
from datetime import datetime
from ...models import Member


# No longer use
def register_byMember(member, all_check, up_limit=100):
    sleep_time_pagetransition = 3
    simultime_blogs = []
    simultime_post_date = ""
    group_id = member.belonging_group.group_id

    if group_id == 1:
        base_url = 'http://www.keyakizaka46.com/s/k46o/diary/member/list?ima=0000&ct=' + member.ct + '&page='
    elif group_id == 2:
        base_url = 'https://www.hinatazaka46.com/s/official/diary/member/list?ima=0000&ct=' + member.ct + '&page='

    urllib3.disable_warnings(InsecureRequestWarning)
    http = urllib3.PoolManager()
    print('start scraping blog written by ' + member.full_kanji)
    for page in range(up_limit):
        print('now scraping page', page + 1, '...')

        url = base_url + str(page)
        r = http.request('GET', url)
        soup = BeautifulSoup(r.data, 'html.parser')

        if group_id == 1:
            blogs = soup.select('article')
        elif group_id == 2:
            blogs = soup.select('div.p-blog-article')

        if not bool(blogs):
            print("finished!!")
            break

        for blog in blogs:
            if group_id == 1:
                bottomul_tag = blog.select_one('div.box-bottom ul')
                bottomli_tags = bottomul_tag.select('li')
                postdate_tag = bottomli_tags[0]
            elif group_id == 2:
                postdate_tag = blog.select_one('div.p-blog-article__info > div.c-blog-article__date')
            post_date = support.datetimeConverter(postdate_tag.text, group_id=group_id)

            if not simultime_blogs and not simultime_post_date:
                simultime_blogs.append(blog)
                simultime_post_date = post_date
            elif simultime_post_date == post_date:
                simultime_blogs.append(blog)
            else:
                if group_id == 1:
                    finished = keyaki.register(simultime_blogs, simultime_post_date, group_id, all_check, False)
                elif group_id == 2:
                    finished = hinata.register(simultime_blogs, simultime_post_date, group_id, all_check, False)

                if finished:
                    break
                simultime_blogs = [blog]
                simultime_post_date = post_date

        else:
            time.sleep(sleep_time_pagetransition)
            continue
        if not all_check:
            break
    else:
        if group_id == 1:
            keyaki.register(simultime_blogs, simultime_post_date, group_id, all_check, False)
        elif group_id == 2:
            hinata.register(simultime_blogs, simultime_post_date, group_id, all_check, False)


def register_latest(group_id, up_limit=100):
    sleep_time_pagetransition = 3
    simultime_blogs = []
    simultime_post_date = ""

    if group_id == 1:
        base_url = 'https://www.keyakizaka46.com/s/k46o/diary/member/list?ima=0000&page='
    elif group_id == 2:
        base_url = 'https://www.hinatazaka46.com/s/official/diary/member/list?ima=0000&page='
    urllib3.disable_warnings(InsecureRequestWarning)
    http = urllib3.PoolManager()
    for page in range(up_limit):
        url = base_url + str(page)
        r = http.request('GET', url)
        soup = BeautifulSoup(r.data, 'html.parser')

        if group_id == 1:
            blogs = soup.select('article')
        elif group_id == 2:
            blogs = soup.select('div.p-blog-article')

        if not bool(blogs):
            print('[', datetime.now(), '] ', end="")
            print("finished!!")
            break

        for blog in blogs:
            if group_id == 1:
                bottomul_tag = blog.select_one('div.box-bottom ul')
                bottomli_tags = bottomul_tag.select('li')
                postdate_tag = bottomli_tags[0]
                # writer_name_origin = blog.select_one('div.box-ttl > p.name').text
            elif group_id == 2:
                postdate_tag = blog.select_one('div.p-blog-article__info > div.c-blog-article__date')
                # writer_name_origin = blog.select_one('div.p-blog-article__info > div.c-blog-article__name').text

            post_date = support.datetimeConverter(postdate_tag.text, group_id=group_id)

            # writer_name = support.textCleaner(writer_name_origin)
            # writer = Member.objects.get(belonging_group__group_id=group_id, full_kanji=writer_name)

            if not simultime_blogs and not simultime_post_date:
                simultime_blogs.append(blog)
                simultime_post_date = post_date
            elif simultime_post_date == post_date:
                simultime_blogs.append(blog)
            else:
                if group_id == 1:
                    finished = keyaki.register(simultime_blogs, simultime_post_date, group_id, False, True)
                elif group_id == 2:
                    finished = hinata.register(simultime_blogs, simultime_post_date, group_id, False, True)

                if finished:
                    break
                simultime_blogs = [blog]
                simultime_post_date = post_date
        else:
            time.sleep(sleep_time_pagetransition)
            print('[', datetime.now(), '] ', end="")
            print('go next page.')
            continue
        break
    else:
        if group_id == 1:
            keyaki.register(simultime_blogs, simultime_post_date, group_id, False, True)
        elif group_id == 2:
            hinata.register(simultime_blogs, simultime_post_date, group_id, False, True)
