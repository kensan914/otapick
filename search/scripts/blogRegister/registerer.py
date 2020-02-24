import urllib3
from bs4 import BeautifulSoup
from urllib3.exceptions import InsecureRequestWarning
import time
from search.scripts.blogRegister.parser import parse_blog, extract_blogs
from search.scripts.blogRegister import support
from search.models import Blog
from search.scripts.blogRegister.unregisterer import unregister, extract_cts


def register_latest(group_id, up_limit=100, all_check=False, unregister_num=1):
    sleep_time_pagetransition = 3
    simultime_blogs = []
    simultime_post_date = ""
    correct_cts_list = []

    for page, is_last in support.lastone(range(up_limit)):
        blogs = extract_blogs(group_id, page)

        if not bool(blogs):
            support.print_console("register unacquired　blog...")
            exe_registration(simultime_blogs, simultime_post_date, group_id, all_check, is_latest=True)
            support.print_console("finished!!")
            break
        if len(correct_cts_list) < unregister_num:
            correct_cts_list.append(extract_cts(blogs, group_id))
        for blog in blogs:
            blog_ct, post_date = parse_blog(group_id, blog, bc=True, ttl=False, pd=True, mem=False)

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
                    unregister(correct_cts_list, group_id, unregister_num)
                    break
                simultime_blogs = [blog]
                simultime_post_date = post_date
        else:
            if is_last:
                exe_registration(simultime_blogs, simultime_post_date, group_id, all_check, is_latest=True)
                break
            time.sleep(sleep_time_pagetransition)
            support.print_console('go next page.')
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
            support.print_console('register 「' + blog_object.title + '」 written by ' + blog_object.writer.full_kanji)

    # When there is at least one already saved blog in blog_list and all_check is False
    if download_count != len(blog_list) and not all_check:
        return True

    # When all blog in blog_list are new or when all_check is True
    else:
        return False
