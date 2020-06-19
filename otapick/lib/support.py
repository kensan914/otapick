from urllib.parse import urlparse
import os
from datetime import datetime
from django.utils.timezone import make_aware

import otapick
from image.models import Image


def clean_text(text):
    text = text.replace('\n', '')
    text = text.replace(' ', '')
    text = text.replace('\t', '')
    return text


def extractBlog_ct(url):
    o = urlparse(url)
    return int(os.path.basename(o.path))


def convert_datetime(datetime_text, group_id):
    new_datetime_text = ' '.join(datetime_text.split())
    if group_id == 1:
        dt = datetime.strptime(new_datetime_text, '%Y/%m/%d %H:%M')
    elif group_id == 2:
        dt = datetime.strptime(new_datetime_text, '%Y.%m.%d %H:%M')
    else:
        dt = None
    return make_aware(dt)


def print_console(text):
    print('[', datetime.now(), '] ', end="")
    print(text)


# When last time in loop, return value with True.
def lastone(iterable):
    # create iterator
    it = iter(iterable)
    # get first element
    last = next(it)

    for val in it:
        # return one before value
        yield last, False
        last = val  # update 'last'

    yield last, True


def shape_ct(group_id, ct):
    if ct is None:
        return group_id, ct

    intCt = int(ct)
    if group_id == 1:
        if intCt < 10:
            return group_id, '0' + str(intCt)
        return group_id, str(intCt)
    elif group_id == 2:
        return group_id, str(intCt)

    return group_id, ct


def generate_watch_more(url):
    return {
        'title': 'もっと見る>',
        'background_image': otapick.WATCH_MORE_IMG_URL,
        'url': url,
    }


def increment_num_of_views(blog, num):
    blog.num_of_views += num
    blog.v1_per_week += num
    blog.save()


def increment_num_of_downloads(images, blog, num):
    for image in images:
        image.num_of_downloads += num
        image.d1_per_week += num
        image.save()

    total_num_of_downloads = 0
    for image in Image.objects.filter(publisher=blog):
        total_num_of_downloads += image.num_of_downloads
    blog.num_of_downloads = total_num_of_downloads
    blog.save()


def edit_num_of_most_downloads(blog):
    blog.num_of_most_downloads = Image.objects.filter(publisher=blog).order_by('-num_of_downloads')[0].num_of_downloads
    blog.save()
