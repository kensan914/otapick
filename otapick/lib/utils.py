from urllib.parse import urlparse
import os
from datetime import datetime
import otapick


def clean_text(text):
    text = text.replace('\n', '')
    text = text.replace(' ', '')
    text = text.replace('\t', '')
    return text


def extract_blog_ct(url):
    o = urlparse(url)
    return int(os.path.basename(o.path))


def print_console(text):
    print('[', datetime.now().strftime("%Y/%m/%d %H:%M:%S"), '] ', end="")
    print(text)

def console_with_blog_info(blog, message):
    print('「{}」({}) {}'.format(blog.title, blog.writer.full_kanji, message))

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


def checkIsMaintaining(BASE_DIR):
    """
    メンテナンス状況の取得
    :return: true(メンテナンス中) false(メンテナンスしていない)
    """
    f = open('{}/config/maintenance_mode_state.txt'.format(BASE_DIR))
    mode_state = otapick.clean_text(f.read())
    f.close()
    return mode_state == '1'
