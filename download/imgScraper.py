from billiard.exceptions import SoftTimeLimitExceeded
from config.celery import TransactionAwareTask
from download.models import Image, Progress
from search.scripts.blogRegister.compresser import compress_img
from celery import shared_task
import requests
import os
import urllib3
from bs4 import BeautifulSoup
from urllib3.exceptions import InsecureRequestWarning
from config import settings
import certifi

from search.scripts.searchViewFunc import get_blog


def get_tag(progress, url, group_id):
    global article_tag
    urllib3.disable_warnings(InsecureRequestWarning)
    http = urllib3.PoolManager(
        cert_reqs='CERT_REQUIRED',
        ca_certs=certifi.where())

    r = http.request('GET', url)
    soup = BeautifulSoup(r.data, 'lxml')

    if group_id == 1:
        article_tag = soup.find('div', class_='box-article')
    elif group_id == 2:
        article_tag = soup.find('div', class_='c-blog-article__text')
    img_tags = article_tag.find_all('img')

    # Omit fake image tag.
    real_img_tags = []
    for img_tag in img_tags:
        img_url = img_tag.get('src')
        if img_url == '' or img_url is None or not img_url.startswith('http'):
            continue
        else:
            real_img_tags.append(img_tag)

    if not real_img_tags:
        progress.num = 100
        progress.save()
        return

    return real_img_tags


def get_img_url(progress, url, group_id):
    url_list = []
    img_tags = get_tag(progress, url, group_id)
    if img_tags is None:
        return
    for img_tag in img_tags:
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


def exe_save_img(group_id, writer_ct, blog_ct, img_url, is_thumbnail=False, crawl_externally=False, img_order=0):
    try:
        member_dir_path = str(group_id) + '_' + writer_ct
        if is_thumbnail:
            media_dir_path = os.path.join("blog_thumbnail", member_dir_path, str(blog_ct))
        else:
            media_dir_path = os.path.join("blog_images", member_dir_path, str(blog_ct))
        dire_path = os.path.join(settings.MEDIA_ROOT, media_dir_path)
        os.makedirs(dire_path, exist_ok=True)
        if crawl_externally: # 公式以外からの取得用
            root, ext = os.path.splitext(img_url)
            file_name = str(blog_ct) + '_' + str(img_order) + ext
            path = os.path.join(dire_path, file_name)
            media = os.path.join(media_dir_path, file_name)
        else:
            file_name = os.path.basename(img_url)
            path = os.path.join(dire_path, file_name)
            media = os.path.join(media_dir_path, file_name)

        img_file = open(path, 'wb')
        urllib3.disable_warnings(InsecureRequestWarning)
        response = requests.get(img_url, verify=False)
        image = response.content
        img_file.write(image)

        img_file.close()

        if is_thumbnail:
            compress_img(os.path.join(settings.MEDIA_ROOT, media))
        return media
    except:
        import traceback
        traceback.print_exc()

        print('Image not Found')
        return None


@shared_task(base=TransactionAwareTask, soft_time_limit=60)
def update(progress_id, group_id, blog_ct, writer_ct):
    try:
        progress = Progress.objects.get(id=progress_id)
        blog = get_blog(group_id, blog_ct)

        global blog_url
        if group_id == 1:
            blog_url = "https://www.keyakizaka46.com/s/k46o/diary/detail/" + str(blog_ct) + "?ima=0000&cd=member"
        elif group_id == 2:
            blog_url = "https://www.hinatazaka46.com/s/official/diary/detail/" + str(blog_ct) + "?ima=0000&cd=member"

        img_urls = get_img_url(progress, blog_url, group_id)
        if img_urls is None:
            return

        save_img(img_urls, progress, group_id, blog_ct, writer_ct, blog)

    #timeout(60s)後の処理
    except SoftTimeLimitExceeded:
        progress = Progress.objects.get(id=progress_id)
        progress.delete()
