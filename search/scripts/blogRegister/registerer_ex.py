import os
import time

import urllib3
from bs4 import BeautifulSoup
from urllib3.exceptions import InsecureRequestWarning

from download.imgScraper import exe_save_img
from download.models import Image, Progress
from search.models import Member, Blog
from search.scripts.blogRegister import support



def register_external(group_id, ct):
    up_limit = 100
    sleep_time_1 = 1
    sleep_time_3 = 3

    if Member.objects.filter(belonging_group__group_id=group_id, ct=ct).exists():
        member = Member.objects.get(belonging_group__group_id=group_id, ct=ct)
    else:
        return False

    base_url = 'https://archive.sakamichi.co/'
    if group_id == 1:
        member_base_url = base_url + 'keyaki/members/' + member.ct
    elif group_id ==2:
        member_base_url = base_url + 'hinata/members/' + member.ct

    urllib3.disable_warnings(InsecureRequestWarning)
    http = urllib3.PoolManager()

    for page in range(1, up_limit):
        if page > 1:
            url = member_base_url + '/p' + str(page)
        else:
            url = member_base_url
        r = http.request('GET', url)
        soup = BeautifulSoup(r.data, 'lxml')
        anchor_tags = soup.select('a.blog-list__item__link')
        if not bool(anchor_tags):
            print('finished!!')
            break

        for anchor_tag in anchor_tags:
            blog_url = base_url + anchor_tag['href']
            blog_ct = os.path.basename(anchor_tag['href'])

            r2 = http.request('GET', blog_url)
            soup2 = BeautifulSoup(r2.data, 'lxml')

            title_tag = soup2.select_one('.blog-view__blog__title')
            title = title_tag.text.strip()

            postdate_tag = soup2.select_one('time')
            post_date = support.convert_datetime(postdate_tag.text, group_id=2)

            content = soup2.select_one('section.blog-view__blog__content')

            blog = Blog.objects.create(
                blog_ct=blog_ct,
                title=title,
                post_date=post_date,
                writer=member,
                text=str(content),
            )

            images = content.select('img')
            for i, image in enumerate(images):
                image_url = base_url + image['src']
                media = exe_save_img(group_id, ct, blog_ct, image_url, crawl_externally=True, img_order=i)
                if media is not None:
                    if not Image.objects.filter(order=i, publisher=blog).exists():
                        Image.objects.create(
                            order=i,
                            picture=media,
                            publisher=blog,
                        )
                else:
                    print('failed media save...')

                time.sleep(sleep_time_1)

            init_progress(blog)
            print('finished blog register.「' + blog.title + '」')
            time.sleep(sleep_time_3)

        print('go to next page...')
        time.sleep(sleep_time_3)


def init_progress(blog):
    if not Progress.objects.filter(target=blog).exists():
        progress = Progress(target=blog)
        progress.num = 100
        progress.ready = True
        progress.save()
