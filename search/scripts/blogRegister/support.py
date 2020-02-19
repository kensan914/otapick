from urllib.parse import urlparse
import os
from datetime import datetime
from django.utils.timezone import make_aware


def textCleaner(text):
    text = text.replace('\n', '')
    text = text.replace(' ', '')
    text = text.replace('\t', '')
    return text


def extractBlog_ct(url):
    o = urlparse(url)
    return int(os.path.basename(o.path))


def datetimeConverter(datetime_text, group_id):
    new_datetime_text = ' '.join(datetime_text.split())
    if group_id == 1:
        dt = datetime.strptime(new_datetime_text, '%Y/%m/%d %H:%M')
    elif group_id == 2:
        dt = datetime.strptime(new_datetime_text, '%Y.%m.%d %H:%M')
    else:
        dt = None
    return make_aware(dt)
