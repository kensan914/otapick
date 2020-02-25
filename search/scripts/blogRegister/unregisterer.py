import time
import urllib3
from bs4 import BeautifulSoup
from urllib3.exceptions import InsecureRequestWarning
from search.models import Blog
from search.scripts.blogRegister import support
from search.scripts.blogRegister.parser import parse_blog, extract_blogs


def unregister(correct_cts_list, group_id, unregister_num):
    for page in range(unregister_num):
        if len(correct_cts_list) <= page and len(correct_cts_list) < unregister_num:
            correct_cts_list.append(extract_cts(extract_blogs(group_id, page), group_id))
        for blog in Blog.objects.filter(writer__belonging_group__group_id=group_id).order_by('-post_date', 'order_for_simul')[20*page:20*(page+1)]:
            if not blog.blog_ct in correct_cts_list[page]:
                support.print_console(str(blog.blog_ct) + "/" + str(group_id) + ' blog is not found in official blog on page ' + str(page) + '.')
                support.print_console('Investigate in detail...')
                exe_unregistration(blog, group_id)


def exe_unregistration(blog, group_id):
    sleep_time_unregister = 1
    blog_url = ''
    if group_id == 1:
        blog_url = 'https://www.keyakizaka46.com/s/k46o/diary/detail/' +  str(blog.blog_ct) + '?ima=0000&cd=member'
    elif group_id == 2:
        blog_url = 'https://www.hinatazaka46.com/s/official/diary/detail/' + str(blog.blog_ct) + '?ima=0000&cd=member'

    urllib3.disable_warnings(InsecureRequestWarning)
    http = urllib3.PoolManager()
    r = http.request('GET', blog_url)
    soup = BeautifulSoup(r.data, 'html.parser')

    if group_id == 1:
        existBlog = soup.select('article')
    elif group_id == 2:
        existBlog = soup.select('div.p-blog-article')

    if not existBlog:
        support.print_console(str(blog.blog_ct) + "/" + str(group_id) + ' blog is not found in official blog. unregister this.')
        blog.delete()
    else:
        support.print_console(str(blog.blog_ct) + "/" + str(group_id) + ' blog is found in official blog. leave this.')
    time.sleep(sleep_time_unregister)

def extract_cts(blogs, group_id):
    cts = []
    for blog in blogs:
        ct = parse_blog(group_id, blog, bc=True, ttl=False, pd=False, mem=False, med=False)
        cts.append(ct)
    return cts