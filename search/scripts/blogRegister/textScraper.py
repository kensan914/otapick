import certifi
import urllib3
from bs4 import BeautifulSoup
from urllib3.exceptions import InsecureRequestWarning


def save_text(blog):
    group_id = blog.writer.belonging_group.group_id
    blog_ct = blog.blog_ct

    if group_id == 1:
        blog_url = "https://www.keyakizaka46.com/s/k46o/diary/detail/" + str(blog_ct) + "?ima=0000&cd=member"
    elif group_id == 2:
        blog_url = "https://www.hinatazaka46.com/s/official/diary/detail/" + str(blog_ct) + "?ima=0000&cd=member"

    urllib3.disable_warnings(InsecureRequestWarning)
    http = urllib3.PoolManager(
        cert_reqs='CERT_REQUIRED',
        ca_certs=certifi.where())

    r = http.request('GET', blog_url)
    soup = BeautifulSoup(r.data, 'lxml')

    if group_id == 1:
        article_tag = soup.find('div', class_='box-article')
    elif group_id == 2:
        article_tag = soup.find('div', class_='c-blog-article__text')

    blog.text = str(article_tag)
    blog.save()
