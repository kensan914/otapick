import os
import time
from datetime import datetime
import urllib3
from bs4 import BeautifulSoup
from django.utils.timezone import make_aware
from urllib3.exceptions import InsecureRequestWarning
from image.models import Image
from main.models import Member, Blog, Group
import otapick


"""
ガラパゴス
もう使わないので、これ以上いじらないし、最適化しない。
"""
def register_external(group_id, ct):
    up_limit = 100
    sleep_time_1 = 1
    sleep_time_3 = 3

    if group_id == 3: group_id = 1 
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

            if not Blog.objects.filter(writer=member, blog_ct=blog_ct).exists():
                r2 = http.request('GET', blog_url)
                soup2 = BeautifulSoup(r2.data, 'lxml')

                title_tag = soup2.select_one('.blog-view__blog__title')
                title = title_tag.text.strip()
                if title == '（無題）':
                    title = ''

                postdate_tag = soup2.select_one('time')

                def convert_datetime(datetime_text, group_id):
                    new_datetime_text = ' '.join(datetime_text.split())
                    if group_id == 1:
                        dt = datetime.strptime(new_datetime_text, '%Y/%m/%d %H:%M')
                    elif group_id == 2:
                        dt = datetime.strptime(new_datetime_text, '%Y.%m.%d %H:%M')
                    else:
                        dt = None
                    return make_aware(dt)

                post_date = convert_datetime(postdate_tag.text, group_id=2)

                content = soup2.select_one('section.blog-view__blog__content')

                blog = Blog.objects.create(
                    blog_ct=blog_ct,
                    title=title,
                    post_date=post_date,
                    writer=member,
                    text=str(content),
                    publishing_group=Group.objects.get(group_id=3 if group_id == 1 else group_id)
                )

                images = content.select('img')

                order=0
                for i, image in enumerate(images):
                    image_url = base_url + image['src']

                    media = otapick.BlogImageDownloader().download(image_url, group_id, blog.blog_ct, blog.writer.ct)
                    if media == 'not_image':  # exclude gif
                        pass
                    elif media is not None:
                        image = Image(
                            order=order,
                            picture=media,
                            publisher=blog,
                        )
                        image.save()
                        otapick.compress_blog_image(image)
                        order += 1
                    else:
                        import traceback
                        traceback.print_exc()

                    time.sleep(sleep_time_1)

                print('finished blog register.「' + blog.title + '」')
                time.sleep(sleep_time_3)

        print('go to next page...')
        time.sleep(sleep_time_3)


