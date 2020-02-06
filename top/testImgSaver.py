import os
import time

import requests
import urllib3
from bs4 import BeautifulSoup
from urllib3.exceptions import InsecureRequestWarning
from config import settings
from download.models import Progress, Image
from search.models import Blog


def get_tag(url, group_id):
    global article_tag
    urllib3.disable_warnings(InsecureRequestWarning)
    http = urllib3.PoolManager()
    r = http.request('GET', url)
    print('rの大きさ', len(r.data))
    soup = BeautifulSoup(r.data, 'html.parser')

    if group_id == 1:
        article_tag = soup.find('div', class_='box-article')
    elif group_id == 2:
        article_tag = soup.find('div', class_='c-blog-article__text')

    img_tags = article_tag.find_all('img')

    return img_tags


def get_img_url(url, group_id):
    url_list = []
    for img_tag in get_tag(url, group_id):
        img_url = img_tag.get('src')
        url_list.append(img_url)
    return url_list


def save_img(img_urls, group_id, blog_ct, writer_ct, progress):
    img_num = len(img_urls)
    for i, img_url in enumerate(img_urls):
        # #base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        # # base_path = settings.BASE_DIR
        # member_dir_path = str(group_id) + '_' + writer_ct
        # media_dir_path = os.path.join("blog_images", member_dir_path, str(blog_ct))
        # # dire_path = os.path.join(base_path, "media", media_dir_path)
        # dire_path = os.path.join(settings.MEDIA_ROOT, media_dir_path)
        #
        # os.makedirs(dire_path, exist_ok=True)
        # path = os.path.join(dire_path, os.path.basename(img_url))
        # media = os.path.join(media_dir_path, os.path.basename(img_url))
        #
        # # res = requests.get(img_url)
        # # res.raise_for_status()
        #
        # # with urllib.request.urlopen(img_url) as web_file:
        # #     data = web_file.read()
        # #     with open(path, mode='wb') as local_file:
        # #         local_file.write(data)
        try:
            os.makedirs('/var/www/otapick/media/blog_images/testes', exist_ok=True)
            #リセット
            path = '/var/www/otapick/media/blog_images/testes/test' + str(i) + '.jpg'
            img_file = open(path, 'wb')

            response = requests.get(img_url)
            image = response.content

            img_file.write(image)
            # for chunk in res:
            #     img_file.write(chunk)

            if not Image.objects.filter(order=i, publisher_id=1).exists():
                Image.objects.create(
                    order=i,
                    picture=path,
                    publisher_id=1,
                )
            img_file.close()
        except:
            print(img_url)
            print('Image not Found')

        progress.num = (i + 1) * 100 / img_num
        progress.save()
        time.sleep(3)

def testImgSave():
    blog_url = 'https://www.keyakizaka46.com/s/k46o/diary/detail/30958?ima=0000&cd=member'
    group_id = 1
    blog_ct = 30958
    writer_ct = '12'
    progress = Progress.objects.get(target_id=1)
    # print(Blog.objects.filter(id=progress.target_id).exists())
    save_img(get_img_url(blog_url, group_id), group_id, blog_ct, writer_ct, progress)

    # os.makedirs('/var/www/otapick/media/blog_images/testes', exist_ok=True)
    #
    # img_file = open('/var/www/otapick/media/blog_images/testes/test.jpg', 'wb')
    # response = requests.get('https://cdn.keyakizaka46.com/files/14/diary/k46/member/moblog/201909/mobMzngmy.jpg')
    # image = response.content
    # img_file.write(image)
    # img_file.close()
    #
    # img_file = open('/var/www/otapick/media/blog_images/testes/test2.jpg', 'wb')
    # response = requests.get('https://cdn.keyakizaka46.com/files/14/diary/k46/member/moblog/201909/mobS03Eyk.jpg')
    # image = response.content
    # img_file.write(image)
    # img_file.close()
    #
    # img_file = open('/var/www/otapick/media/blog_images/testes/test3.jpg', 'wb')
    # response = requests.get('https://cdn.keyakizaka46.com/files/14/diary/k46/member/moblog/201909/mobUWU5g7.jpg')
    # image = response.content
    # img_file.write(image)
    # img_file.close()

