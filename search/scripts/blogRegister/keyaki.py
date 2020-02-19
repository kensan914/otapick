from search.scripts.blogRegister import support
import urllib3
from bs4 import BeautifulSoup
from urllib3.exceptions import InsecureRequestWarning
from ...models import Blog, Member
import time
from datetime import datetime


def register(blog_list, post_date, group_id, all_check, is_latest):
    download_count = 0
    blog_objects = []

    for i, blog in enumerate(blog_list):
        bottomul_tag = blog.select_one('div.box-bottom ul')
        bottomli_tags = bottomul_tag.select('li')
        blog_url = bottomli_tags[1].find('a').get('href')

        if not Blog.objects.filter(blog_ct=support.extractBlog_ct(blog_url),
                                   writer__belonging_group__group_id=group_id).exists():
            title_tag = blog.select_one('h3 > a')
            title = support.textCleaner(title_tag.text)

            writer_name_origin = blog.select_one('div.box-ttl > p.name').text
            writer_name = support.textCleaner(writer_name_origin)
            member = Member.objects.get(belonging_group__group_id=group_id, full_kanji=writer_name)

            blog_objects.append(Blog(
                blog_ct=support.extractBlog_ct(blog_url),
                title=title,
                post_date=post_date,
                order_for_simul=i,
                writer=member,
            ))
            download_count += 1
        else:
            saved_blog = Blog.objects.get(blog_ct=support.extractBlog_ct(blog_url),
                                          writer__belonging_group__group_id=group_id)
            saved_blog.order_for_simul += download_count
            saved_blog.save()
    if download_count != len(blog_list) and not all_check:
        for blog_object in blog_objects:
            blog_object.save()

        if not is_latest:
            print('kept up latest ' + member.full_kanji + '!!')
        return True
    else:
        if Blog.objects.filter(post_date=post_date).exists():
            for saved_simultime_blog in Blog.objects.filter(post_date=post_date):
                saved_simultime_blog.order_for_simul += download_count
                saved_simultime_blog.save()

        for blog_object in blog_objects:
            blog_object.save()
            if is_latest:
                print('[', datetime.now(), '] ', end="")
                print('register 「' + blog_object.title + '」 written by ' + blog_object.writer.full_kanji)
        return False


# def blogRegisterByM_keyaki(member, all_check, up_limit=100):
#     sleep_time_pagetransition = 3
#     simultime_blogs = []
#     simultime_post_date = ""
#     group_id = member.belonging_group__group_id
#
#     if group_id == 1:
#         base_url = 'http://www.keyakizaka46.com/s/k46o/diary/member/list?ima=0000&ct=' + member.ct + '&page='
#     elif group_id == 2:
#         base_url = 'https://www.hinatazaka46.com/s/official/diary/member/list?ima=0000&ct=' + member.ct + '&page='
#
#     urllib3.disable_warnings(InsecureRequestWarning)
#     http = urllib3.PoolManager()
#     print('start scraping blog written by ' + member.full_kanji)
#     for page in range(up_limit):
#         print('now scraping page', page + 1, '...')
#
#         url = base_url + str(page)
#         r = http.request('GET', url)
#         soup = BeautifulSoup(r.data, 'html.parser')
#
#         if group_id == 1:
#             blogs = soup.select('article')
#         elif group_id == 2:
#             blogs = soup.select('div.p-blog-article')
#
#         if not bool(blogs):
#             print("finished!!")
#             break
#
#         for blog in blogs:
#             if group_id == 1:
#                 bottomul_tag = blog.select_one('div.box-bottom ul')
#                 bottomli_tags = bottomul_tag.select('li')
#                 postdate_tag = bottomli_tags[0]
#             elif group_id == 2:
#                 postdate_tag = blog.select_one('div.p-blog-article__info > div.c-blog-article__date')
#             post_date = datetimeConverter(postdate_tag.text, group_id=group_id)
#
#             if not simultime_blogs and not simultime_post_date:
#                 simultime_blogs.append(blog)
#                 simultime_post_date = post_date
#             elif simultime_post_date == post_date:
#                 simultime_blogs.append(blog)
#             else:
#                 finished = blogRegister(simultime_blogs, simultime_post_date, member, group_id, all_check)
#                 if finished:
#                     break
#                 simultime_blogs = [blog]
#                 simultime_post_date = post_date
#
#             # bottomul_tag = blog.select_one('div.box-bottom ul')
#             # bottomli_tags = bottomul_tag.select('li')
#             # blog_url = bottomli_tags[1].find('a').get('href')
#             #
#             # if not Blog.objects.filter(blog_ct=extractBlog_ct(blog_url),
#             #                            writer__belonging_group__group_id=1).exists():
#             #     title_tag = blog.select_one('h3 > a')
#             #     title = textCleaner(title_tag.text)
#             #     postdate_tag = bottomli_tags[0]
#             #     Blog.objects.create(
#             #         blog_ct=extractBlog_ct(blog_url),
#             #         title=title,
#             #         post_date=datetimeConverter(postdate_tag.text, group_id=1),
#             #         writer=member,
#             #     )
#             # else:
#             #     if not all_check:
#             #         print('kept up latest ' + member.full_kanji + '!!')
#             #         break
#         else:
#             time.sleep(sleep_time_pagetransition)
#             continue
#         if not all_check:
#             break

