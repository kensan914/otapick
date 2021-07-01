import time
from api.models.main.models import Blog, Group
from api import otapick


def unregister(correct_cts_list, group, unregister_num):
    group_id = group.group_id
    paginate_by = group.blog_list_paginate_by
    blog_crawler = otapick.BlogListCrawler()
    groups = Group.objects.filter(group_id=group_id)
    if not groups.exists():
        return
    group_key = groups.first().key
    for page in range(unregister_num):
        # unregister_numを2以上で設定していた時、1ページ目で登録処理が終了した場合など
        if len(correct_cts_list) <= page and len(correct_cts_list) < unregister_num:
            blogs_data = blog_crawler.crawl(group_key, page)
            correct_cts_list.append([blog_info["blog_ct"] for blog_info in blogs_data])
        for blog in Blog.objects.filter(
            publishing_group__group_id=group_id, writer__graduate=False
        ).order_by("-post_date", "order_for_simul")[
            paginate_by * page : paginate_by * (page + 1)
        ]:
            if not blog.blog_ct in correct_cts_list[page]:
                otapick.print_console(
                    str(blog.blog_ct)
                    + "/"
                    + str(group_id)
                    + " blog is not found in official blog on page "
                    + str(page)
                    + "."
                )
                otapick.print_console("Investigate in detail...")
                exe_unregistration(blog, group_id, group_key)


def exe_unregistration(blog, group_id, group_key):
    sleep_time_unregister = 1
    blog_info = otapick.BlogDetailCrawler().crawl(
        group_key=group_key, blog_ct=blog.blog_ct
    )

    if blog_info is None:
        return
    elif blog_info == 404:
        otapick.print_console(
            str(blog.blog_ct)
            + "/"
            + str(group_id)
            + " blog is not found in official blog. unregister this."
        )
        blog.delete()
    else:
        otapick.print_console(
            str(blog.blog_ct)
            + "/"
            + str(group_id)
            + " blog is found in official blog. leave this. and execute get_blogs -p 5 -a -t"
        )
        # ページ中間位置に未取得のブログがあった場合、延々ここが呼ばれてしまうため、対処↓
        otapick.register_blogs(
            group_id=group_id, up_limit=5, all_check=True, tweet=True
        )

    time.sleep(sleep_time_unregister)
