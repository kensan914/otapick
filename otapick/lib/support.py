from urllib.parse import urlparse
import os
from datetime import datetime
from django.utils.timezone import make_aware


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
        'background_image': '/static/img/watch_more.png',
        'url': url,
    }
