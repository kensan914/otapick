import os
from billiard.exceptions import SoftTimeLimitExceeded
from celery import shared_task
from api import otapick
from config.celery import TransactionAwareTask
from api.models.image.models import Image
from api.models.main.models import Blog


@shared_task(base=TransactionAwareTask, soft_time_limit=60)
def download_blog_images(group_id, group_key, blog_ct, writer_ct):
    """
    非同期でブログ画像をダウンロード、旧imgScraper.update()
    :param group_id:
    :param group_key:
    :param blog_ct:
    :param writer_ct:
    :return:
    """
    try:
        blog = Blog.objects.get(publishing_group__group_id=group_id, blog_ct=blog_ct)
        img_urls = otapick.BlogImageCrawler().crawl(
            group_key=group_key, blog_ct=blog_ct
        )

        # crawl error
        if img_urls is None:
            pass
        # image not found
        elif len(img_urls) == 0:
            pass
        else:
            # clear halfway remaining images
            Image.objects.filter(publisher=blog).delete()
            order = 0
            for i, img_url in enumerate(img_urls):
                media = otapick.BlogImageDownloader().download(
                    img_url, group_id, blog_ct, writer_ct
                )
                if media == "not_image":  # exclude gif
                    pass
                elif media is not None:
                    if not Image.objects.filter(order=i, publisher=blog).exists():
                        image = Image(
                            order=order,
                            picture=media,
                            publisher=blog,
                        )
                        image.save()
                        otapick.compress_blog_image(image)
                        order += 1
                # image download failed
                else:
                    import traceback

                    traceback.print_exc()

    # timeout(60s)後の処理
    except SoftTimeLimitExceeded:
        pass


def delete_image(target_image):
    """
    imageモデルを安全に削除。order等を考慮。同時にファイルも削除。
    :param target_image:
    :return:
    """
    blog = target_image.publisher
    target_image.delete()
    os.remove(str(target_image.picture.path))  # remove file
    images = Image.objects.filter(publisher=blog).order_by("order")
    for i, image in enumerate(images):
        image.order = i
        image.save()


def sort_images(images, order_format):
    """
    order_byの引数を生成。
    :param order_format:
    :return: None(have to sort by recommend), images(others)
    """
    if order_format and order_format != "recommend":
        if order_format == "newer_post":
            pass
        elif order_format == "older_post":
            images = images.order_by(
                "publisher__post_date", "-publisher__order_for_simul", "-order"
            )
        elif order_format == "dl":
            images = images.order_by("-num_of_downloads", "-recommend_score")
        elif order_format == "popularity":
            images = images.order_by("-score", "-recommend_score")
        elif order_format == "view":
            images = images.order_by("-num_of_views", "-recommend_score")
    else:
        return

    # return images
    return images


def get_filtered_images_group_ids(group_ids):
    """
    推しグループでfilter
    group_ids(ex. [1, 2])でImageを絞り込み返す.
    group_idsに一つでもint以外が含まれた場合 Image.objects.all()
    """
    if group_ids and all([type(g) is int for g in group_ids]):
        images = Image.objects.filter(
            publisher__publishing_group__group_id__in=group_ids
        )
        if not images.exists():
            images = Image.objects.all()
    else:
        images = Image.objects.all()

    return images
