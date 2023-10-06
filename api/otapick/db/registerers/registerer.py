import time
from api import otapick
from api.models.main.models import Blog, Group
from api.models.image.models import Image
from .unregisterer import unregister


def register_blogs(
    group_id, up_limit=100, all_check=False, unregister_num=1, tweet=False
):
    """
    グループごとにブログの登録を行う。以下、処理の流れ。
    最新から次々チェックしていき、保存済みのブログに当たったら終了。また、一番最後まで行ったら終了。これまでを仮にプロセスと呼ぶ。
    プロセス間はをリスト(simultime_blogs)を所持して毎ブログ、リストにappendしていく。次のブログが先ほどのブログと違った時間なら解放(1)。同時刻ならappendする。(1)の解放のタイミングでリストの中のblogを登録する。
    この時、保存済みのblogに同時刻があるか調べる。
    1. なかったら
        添字をそのままorder_for_simulに書き込み、全てのblogを登録。
    2. あったら
        添字をそのままorder_for_simulに書き込み、全てのblogを登録。加えて、リストのサイズ分だけ保存済みのblogのorder_for_simulに足す。

    Args:
        group_id (int): グループID
        up_limit (int): 最大ページ(default: 100)
        all_check (bool): 保存済みのブログを見つけても処理を実行(default: False)
        unregister_num (int): 何ページ分、登録解除処理をするか(default: 1)
        tweet (bool): 更新通知をtweetするか否か
    Returns:
        True(success), None(failed)
    """

    sleep_time_pagetransition = 3
    simultime_blogs = []
    simultime_post_date = ""
    correct_cts_list = []  # [[234, 3422, ...], [214, 423, ...]]

    blog_crawler = otapick.BlogListCrawler()
    groups = Group.objects.filter(group_id=group_id)
    group = groups.first()
    group_key = group.key
    for page, is_last in otapick.lastone(range(up_limit)):
        blogs_data = blog_crawler.crawl(group_key, page)
        if blogs_data is None:
            return
        elif len(blogs_data) == 0:
            otapick.print_console("register unacquired blog...")
            exe_registration(
                simultime_blogs,
                simultime_post_date,
                group_id,
                all_check,
                tweet,
                console=True,
            )
            otapick.print_console("finished!!")
            break
        if len(correct_cts_list) < unregister_num:
            correct_cts = [blog_info["blog_ct"] for blog_info in blogs_data]
            correct_cts_list.append(correct_cts)
        for blog_info in blogs_data:
            # first time
            if not simultime_blogs and not simultime_post_date:
                simultime_blogs.append(blog_info)
                simultime_post_date = blog_info["post_date"]
            # When the post_date is same time as previous one,
            elif simultime_post_date == blog_info["post_date"]:
                simultime_blogs.append(blog_info)
            # When the post_date isn't same time as previous one,
            else:
                finished = exe_registration(
                    simultime_blogs,
                    simultime_post_date,
                    group_id,
                    all_check,
                    tweet,
                    console=True,
                )

                if finished:
                    unregister(correct_cts_list, group, unregister_num)
                    break
                simultime_blogs = [blog_info]
                simultime_post_date = blog_info["post_date"]
        else:
            if is_last:
                exe_registration(
                    simultime_blogs,
                    simultime_post_date,
                    group_id,
                    all_check,
                    tweet,
                    console=True,
                )
                break
            time.sleep(sleep_time_pagetransition)
            otapick.print_console("go next page.")
            continue
        break
    return True


def exe_registration(blog_info_list, post_date, group_id, all_check, tweet, console):
    """
    ブログの登録処理
    Args:
        blog_info_list (list): ブログ情報のリスト。前提としてリストの中のブログは同じpost_dateを持つ。
        post_date (date): 共通のpost_date
        group_id (int): グループID
        all_check (bool): 保存済みのブログを見つけても処理を実行
        tweet (bool): 更新通知をtweetするか否か
        console (bool): ログ出力するか否か
    Returns:
        True(登録処理終了), False(登録処理続行)
    """
    download_count = 0
    blog_objects = []
    image_objects = []

    for i, blog_info in enumerate(blog_info_list):
        # new blog
        if not Blog.objects.filter(
            blog_ct=blog_info["blog_ct"], publishing_group__group_id=group_id
        ).exists():
            blog = Blog(
                blog_ct=blog_info["blog_ct"],
                title=blog_info["title"],
                post_date=post_date,
                order_for_simul=i,
                writer=blog_info["member"],
                publishing_group=Group.objects.filter(group_id=group_id).first(),
            )
            blog_objects.append(blog)
            download_count += 1
        # already saved
        else:
            blog = Blog.objects.get(
                blog_ct=blog_info["blog_ct"], publishing_group__group_id=group_id
            )

        if len(blog_info["image_urls"]) > 0:
            order = 0
            for image_url in blog_info["image_urls"]:
                if not Image.objects.filter(publisher=blog).exists():
                    media = otapick.BlogImageDownloader().download(
                        image_url, group_id, blog.blog_ct, blog.writer.ct
                    )
                    if media == "not_image":  # exclude gif
                        pass
                    elif media is not None:
                        image = Image(
                            order=order,
                            picture=media,
                            publisher=blog,
                        )

                        # set width & height
                        w, h = otapick.get_image_w_h(image)
                        image.width = w
                        image.height = h

                        image_objects.append(image)
                        order += 1
                    else:
                        import traceback

                        traceback.print_exc()

        # change the order_for_simul of already saved blog with the same post_date
        if Blog.objects.filter(post_date=post_date).exists():
            for saved_simultime_blog in Blog.objects.filter(post_date=post_date):
                saved_simultime_blog.order_for_simul += download_count
                saved_simultime_blog.save()

    # save new blog
    for blog_object in blog_objects:
        blog_object.save()
        if console:
            otapick.print_console(
                "register 「"
                + blog_object.title
                + "」 written by "
                + blog_object.writer.full_kanji
            )

    # save new image
    for image_object in image_objects:
        image_object.save()
        otapick.compress_blog_image(image_object)

    # tweet update info
    if tweet:
        updateBot = otapick.UpdateBot()
        for blog_object in blog_objects:
            updateBot.tweet(
                group_id=blog_object.publishing_group.group_id,
                blog_ct=blog_object.blog_ct,
            )

    # When there is at least one already saved blog in blog_list and all_check is False
    if download_count != len(blog_info_list) and not all_check:
        return True

    # When all blog in blog_list are new or when all_check is True
    else:
        return False


def register_text(blog):
    """
    受け取ったブログのtext(本文)を登録。
    Args:
        blog (Blog Model object): ブログモデルオブジェクト。
    """
    group_key = blog.publishing_group.key
    blog_ct = blog.blog_ct

    text = otapick.TextCrawler().crawl(group_key=group_key, blog_ct=blog_ct)
    blog.text = text
    blog.save()
