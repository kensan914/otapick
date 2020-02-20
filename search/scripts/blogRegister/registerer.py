import urllib3
from bs4 import BeautifulSoup
from urllib3.exceptions import InsecureRequestWarning
import time
from datetime import datetime
from search.scripts.blogRegister.parser import parse_blog
from search.scripts.blogRegister import support
from search.models import Blog


def register_latest(group_id, up_limit=100, all_check=False):
    sleep_time_pagetransition = 3
    simultime_blogs = []
    simultime_post_date = ""

    if group_id == 1:
        base_url = 'https://www.keyakizaka46.com/s/k46o/diary/member/list?ima=0000&page='
    elif group_id == 2:
        base_url = 'https://www.hinatazaka46.com/s/official/diary/member/list?ima=0000&page='

    urllib3.disable_warnings(InsecureRequestWarning)
    http = urllib3.PoolManager()
    for page, is_last in support.lastone(range(up_limit)):
        url = base_url + str(page)
        r = http.request('GET', url)
        soup = BeautifulSoup(r.data, 'html.parser')

        if group_id == 1:
            blogs = soup.select('article')
        elif group_id == 2:
            blogs = soup.select('div.p-blog-article')

        if not bool(blogs):
            print('[', datetime.now(), '] ', end="")
            print("register unacquired　blog...")
            exe_registration(simultime_blogs, simultime_post_date, group_id, all_check, is_latest=True)
            print('[', datetime.now(), '] ', end="")
            print("finished!!")
            break

        for blog in blogs:
            post_date = parse_blog(group_id, blog, bc=False, ttl=False, pd=True, mem=False)

            # first time
            if not simultime_blogs and not simultime_post_date:
                simultime_blogs.append(blog)
                simultime_post_date = post_date
            # When the post_date is same time as previous one,
            elif simultime_post_date == post_date:
                simultime_blogs.append(blog)
            # When the post_date isn't same time as previous one,
            else:
                finished = exe_registration(simultime_blogs, simultime_post_date, group_id, all_check, is_latest=True)

                if finished:
                    break
                simultime_blogs = [blog]
                simultime_post_date = post_date
        else:
            if is_last:
                exe_registration(simultime_blogs, simultime_post_date, group_id, all_check, is_latest=True)
                break
            time.sleep(sleep_time_pagetransition)
            print('[', datetime.now(), '] ', end="")
            print('go next page.')
            continue
        break


def exe_registration(blog_list, post_date, group_id, all_check, is_latest):
    download_count = 0
    blog_objects = []

    for i, blog in enumerate(blog_list):
        blog_ct = parse_blog(group_id, blog, bc=True, ttl=False, pd=False, mem=False)

        # new blog
        if not Blog.objects.filter(blog_ct=blog_ct,
                                   writer__belonging_group__group_id=group_id).exists():
            title, member = parse_blog(group_id, blog, bc=False, ttl=True, pd=False, mem=True)

            blog_objects.append(
                Blog(
                    blog_ct=blog_ct,
                    title=title,
                    post_date=post_date,
                    order_for_simul=i,
                    writer=member,
                )
            )
            download_count += 1
        # already saved
        else:
            pass

    # change the order_for_simul of already saved blog with the same post_date
    if Blog.objects.filter(post_date=post_date).exists():
        for saved_simultime_blog in Blog.objects.filter(post_date=post_date):
            saved_simultime_blog.order_for_simul += download_count
            saved_simultime_blog.save()

    # save new blog
    for blog_object in blog_objects:
        blog_object.save()
        if is_latest:
            print('[', datetime.now(), '] ', end="")
            print('register 「' + blog_object.title + '」 written by ' + blog_object.writer.full_kanji)

    # When there is at least one already saved blog in blog_list and all_check is False
    if download_count != len(blog_list) and not all_check:
        return True

    # When all blog in blog_list are new or when all_check is True
    else:
        return False
