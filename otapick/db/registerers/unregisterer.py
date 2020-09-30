import time
from main.models import Blog
import otapick


def unregister(correct_cts_list, group_id, unregister_num):
    blog_crawler = otapick.BlogListCrawler()
    for page in range(unregister_num):
        # unregister_numを2以上で設定していた時、1ページ目で登録処理が終了した場合など
        if len(correct_cts_list) <= page and len(correct_cts_list) < unregister_num:
            blogs_data = blog_crawler.crawl(group_id, page)
            correct_cts_list.append([blog_info['blog_ct'] for blog_info in blogs_data])
        for blog in Blog.objects.filter(writer__belonging_group__group_id=group_id).order_by('-post_date', 'order_for_simul')[20*page:20*(page+1)]:
            if not blog.blog_ct in correct_cts_list[page]:
                otapick.print_console(str(blog.blog_ct) + "/" + str(group_id) + ' blog is not found in official blog on page ' + str(page) + '.')
                otapick.print_console('Investigate in detail...')
                exe_unregistration(blog, group_id)


def exe_unregistration(blog, group_id):
    sleep_time_unregister = 1
    blog_info = otapick.BlogDetailCrawler().crawl(group_id, blog.blog_ct)

    if blog_info is None:
        return
    elif blog_info == 'blog not found':
        otapick.print_console(str(blog.blog_ct) + "/" + str(group_id) + ' blog is not found in official blog. unregister this.')
        blog.delete()
    else:
        otapick.print_console(str(blog.blog_ct) + "/" + str(group_id) + ' blog is found in official blog. leave this. and execute get_blogs -p 5 -a -t')
        # ページ中間位置に未取得のブログがあった場合、延々ここが呼ばれてしまうため、対処↓
        otapick.register_blogs(group_id=group_id, up_limit=5, all_check=True, tweet=True)

    time.sleep(sleep_time_unregister)
