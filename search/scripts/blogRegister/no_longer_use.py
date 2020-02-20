import urllib3
from bs4 import BeautifulSoup
from urllib3.exceptions import InsecureRequestWarning
import time
from search.scripts.blogRegister.parser import parse_blog
from search.scripts.blogRegister.registerer import exe_registration


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
            exe_registration(simultime_blogs, simultime_post_date, group_id, all_check, False)
            print("finished!!")
            break

        for blog in blogs:
            post_date = parse_blog(group_id, blog, bc=False, ttl=False, pd=True, mem=False)

            if not simultime_blogs and not simultime_post_date:
                simultime_blogs.append(blog)
                simultime_post_date = post_date
            elif simultime_post_date == post_date:
                simultime_blogs.append(blog)
            else:
                finished = exe_registration(simultime_blogs, simultime_post_date, group_id, all_check, False)

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
        exe_registration(simultime_blogs, simultime_post_date, group_id, all_check, False)
