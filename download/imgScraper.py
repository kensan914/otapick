from config.celery import TransactionAwareTask
from download.models import Image, Progress
from download.scripts.downloadViewFunc import get_blog
from celery import shared_task
import time
import requests
import os
import urllib3
from bs4 import BeautifulSoup
from urllib3.exceptions import InsecureRequestWarning
from config import settings
import certifi


def get_tag(progress, url, group_id):
    global article_tag
    urllib3.disable_warnings(InsecureRequestWarning)
    http = urllib3.PoolManager(
        cert_reqs='CERT_REQUIRED',
        ca_certs=certifi.where())

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
        media = exe_save_img(group_id, writer_ct, blog_ct, img_url)
        if media is not None:
            if not Image.objects.filter(order=i, publisher=blog).exists():
                Image.objects.create(
                    order=i,
                    picture=media,
                    publisher=blog,
                )

        progress.num = (i + 1) * 100 / img_num
        progress.save()

        time.sleep(1)


def exe_save_img(group_id, writer_ct, blog_ct, img_url):
    try:
        member_dir_path = str(group_id) + '_' + writer_ct
        media_dir_path = os.path.join("blog_images", member_dir_path, str(blog_ct))
        dire_path = os.path.join(settings.MEDIA_ROOT, media_dir_path)
        os.makedirs(dire_path, exist_ok=True)
        path = os.path.join(dire_path, os.path.basename(img_url))
        media = os.path.join(media_dir_path, os.path.basename(img_url))

        img_file = open(path, 'wb')
        urllib3.disable_warnings(InsecureRequestWarning)
        response = requests.get(img_url, verify=False)
        image = response.content
        img_file.write(image)

        img_file.close()
        return media
    except:
        print('Image not Found')
        return None


@shared_task(base=TransactionAwareTask)
def update(progress_id, group_id, blog_ct, writer_ct):
    progress = Progress.objects.get(id=progress_id)
    blog = get_blog(group_id, blog_ct)

    global blog_url
    if group_id == 1:
        blog_url = "https://www.keyakizaka46.com/s/k46o/diary/detail/" + str(blog_ct) + "?ima=0000&cd=member"
    elif group_id == 2:
        blog_url = "https://www.hinatazaka46.com/s/official/diary/detail/" + str(blog_ct) + "?ima=0000&cd=member"

    save_img(get_img_url(progress, blog_url, group_id), progress, group_id, blog_ct, writer_ct, blog)
