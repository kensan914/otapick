import time

import requests
import os
import urllib3
from bs4 import BeautifulSoup
from urllib3.exceptions import InsecureRequestWarning
from .models import Image


def get_tag(progress, url, group_id):
    global article_tag
    urllib3.disable_warnings(InsecureRequestWarning)
    http = urllib3.PoolManager()
    r = http.request('GET', url)
    soup = BeautifulSoup(r.data, 'html.parser')

    if group_id == 1:
        article_tag = soup.find('div', class_='box-article')
    elif group_id == 2:
        article_tag = soup.find('div', class_='c-blog-article__text')

    img_tags = article_tag.find_all('img')

    if not img_tags:
        progress.num = 100
        progress.save()
        quit()

    return img_tags


def get_img_url(progress, url, group_id):
    url_list = []
    for img_tag in get_tag(progress, url, group_id):
        img_url = img_tag.get('src')
        url_list.append(img_url)
    return url_list


def save_img(img_urls, progress, group_id, blog_ct, writer_ct, blog):
    img_num = len(img_urls)
    for i, img_url in enumerate(img_urls):
        try:
            res = requests.get(img_url)
            res.raise_for_status()

            base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            member_dir_path = str(group_id) + '_' + writer_ct
            dire_path = os.path.join(base_path, "media", "blog_images", member_dir_path, str(blog_ct))
            os.makedirs(dire_path, exist_ok=True)
            path = os.path.join(dire_path, os.path.basename(img_url))
            img_file = open(path, 'wb')
            for chunk in res:
                img_file.write(chunk)
            if not Image.objects.filter(order=i, publisher=blog).exists():
                Image.objects.create(
                    order=i,
                    picture=path,
                    publisher=blog,
                )
            img_file.close()
        except:
            print('Image not Found')

        progress.num = (i + 1) * 100 / img_num
        progress.save()
        time.sleep(1)


def update(progress, group_id, blog_ct, writer_ct, blog):
    global blog_url
    if group_id == 1:
        blog_url = "https://www.keyakizaka46.com/s/k46o/diary/detail/" + str(blog_ct) + "?ima=0000&cd=member"
    elif group_id == 2:
        blog_url = "https://www.hinatazaka46.com/s/official/diary/detail/" + str(blog_ct) + "?ima=0000&cd=member"
    save_img(get_img_url(progress, blog_url, group_id), progress, group_id, blog_ct, writer_ct, blog)
