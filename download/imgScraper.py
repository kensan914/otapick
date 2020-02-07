#テスト
import django

from download.scripts.downloadViewFunc import blog_getter

django.setup()
from celery import shared_task

import threading
import time
import urllib
import requests
import os
import urllib3
from bs4 import BeautifulSoup
from urllib3.exceptions import InsecureRequestWarning
from .models import Image, Progress
from config import settings
import certifi


def get_tag(progress, url, group_id):
    global article_tag
    #テスト　
    print('get_tagスタート。。1')
    urllib3.disable_warnings(InsecureRequestWarning)
    http = urllib3.PoolManager(
        cert_reqs='CERT_REQUIRED',
        ca_certs=certifi.where())

    # テスト　#1分以上
    print('get_tagスタート。。2')
    r = http.request('GET', url)
    print('rの大きさ', len(r.data))

    # テスト
    print('get_tagスタート。。3.1')
    r_data = r.data
    print('get_tagスタート。。3.2')
    # 1分以上　
    soup = BeautifulSoup(r_data, 'html.parser')

    # テスト　#ちょいかかり
    print('get_tagスタート。。4')

    if group_id == 1:
        article_tag = soup.find('div', class_='box-article')
    elif group_id == 2:
        article_tag = soup.find('div', class_='c-blog-article__text')

    # テスト　
    print('get_tagスタート。。5')
    img_tags = article_tag.find_all('img')

    if not img_tags:
        progress.num = 100
        progress.save()
        quit()
    # テスト　
    print('get_tagスタート。。6')

    return img_tags


def get_img_url(progress, url, group_id):
    url_list = []
    for img_tag in get_tag(progress, url, group_id):
        img_url = img_tag.get('src')
        url_list.append(img_url)
    return url_list


def save_img(img_urls, progress, group_id, blog_ct, writer_ct, blog):
    img_num = len(img_urls)

    #テスト
    print('save_imgスタート。。1...', img_num)
    for i, img_url in enumerate(img_urls):

        #base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        # base_path = settings.BASE_DIR

        member_dir_path = str(group_id) + '_' + writer_ct
        media_dir_path = os.path.join("blog_images", member_dir_path, str(blog_ct))

        # dire_path = os.path.join(base_path, "media", media_dir_path)
        dire_path = os.path.join(settings.MEDIA_ROOT, media_dir_path)

        os.makedirs(dire_path, exist_ok=True)
        path = os.path.join(dire_path, os.path.basename(img_url))
        media = os.path.join(media_dir_path, os.path.basename(img_url))

        # res = requests.get(img_url)
        # res.raise_for_status()

        # with urllib.request.urlopen(img_url) as web_file:
        #     data = web_file.read()
        #     with open(path, mode='wb') as local_file:
        #         local_file.write(data)
        img_file = open(path, 'wb')

        # try:
        # テスト
        print('save_imgスタート。。2.1')

        urllib3.disable_warnings(InsecureRequestWarning)

        # テスト　#鬼かかり
        print('save_imgスタート。。2.2')
        response = requests.get(img_url, verify=False)

        # テスト
        print('save_imgスタート。。3')
        image = response.content
        # テスト
        print('save_imgスタート。。4')

        img_file.write(image)
        # for chunk in res:
        #     img_file.write(chunk)

        # テスト
        print('save_imgスタート。。5')
        if not Image.objects.filter(order=i, publisher_id=blog.id).exists():
            #テスト
            print('order: ', i, 'picture: ', media, 'publisher_id', blog.id)
            Image.objects.create(
                order=i,
                picture=media,
                publisher_id=blog.id,
            )
            print('save_imgスタート。。6')
        img_file.close()
        # except:
        #     print('Image not Found')
        print('save_imgスタート。。7')
        progress.num = (i + 1) * 100 / img_num
        print('save_imgスタート。。8')
        progress.save()

        print('save_imgスタート。。9')
        time.sleep(1)


@shared_task
def update(target_id, group_id, blog_ct, writer_ct):
    print('start update()')
    #テスト
    print('propro: ', Progress.objects.filter(target_id=target_id).exists())
    progress = Progress.objects.get(target_id=target_id)
    blog = blog_getter(group_id, blog_ct)

    global blog_url
    if group_id == 1:
        blog_url = "https://www.keyakizaka46.com/s/k46o/diary/detail/" + str(blog_ct) + "?ima=0000&cd=member"
    elif group_id == 2:
        blog_url = "https://www.hinatazaka46.com/s/official/diary/detail/" + str(blog_ct) + "?ima=0000&cd=member"
    # テスト
    print('現在のスレッド数', threading.active_count())
    save_img(get_img_url(progress, blog_url, group_id), progress, group_id, blog_ct, writer_ct, blog)
