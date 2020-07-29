import os
import time

from billiard.exceptions import SoftTimeLimitExceeded
from celery import shared_task
from rest_framework import status
import otapick
from config.celery import TransactionAwareTask
from config.settings import BASE_DIR
from image.models import Progress, Image
from main.models import Blog
import subprocess


@shared_task(base=TransactionAwareTask, soft_time_limit=60)
def download_blog_images(progress_id, group_id, blog_ct, writer_ct):
    """
    非同期でブログ画像をダウンロード、プログレスの処理まで担当。旧imgScraper.update()
    :param progress_id:
    :param group_id:
    :param blog_ct:
    :param writer_ct:
    :return:
    """
    try:
        progress = Progress.objects.get(id=progress_id)
        blog = Blog.objects.get(writer__belonging_group__group_id=group_id, blog_ct=blog_ct)

        img_urls = otapick.BlogImageCrawler().crawl(group_id, blog_ct)

        # crawl error
        if img_urls is None:
            progress.delete()
        # image not found
        elif len(img_urls) == 0:
            progress.num = 100
            progress.ready = True
            progress.save()
        else:
            Image.objects.filter(publisher=progress.target).delete() # clear halfway remaining images
            img_num = len(img_urls)
            order = 0
            for i, img_url in enumerate(img_urls):
                media = otapick.BlogImageDownloader().download(img_url, group_id, blog_ct, writer_ct)
                if media == 'not_image': # exclude gif
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
                progress.num = (i + 1) * 100 / img_num
                if progress.num >= 100: progress.ready = True
                progress.save()

    #timeout(60s)後の処理
    except SoftTimeLimitExceeded:
        progress = Progress.objects.get(id=progress_id)
        progress.delete()


def accept_image_download(group_id, blog_ct):
    """
    Blog詳細をviewする際、そのブログのプログレスが不十分な時に呼ばれる。ブログは存在している状態。
    :param group_id:
    :param blog_ct:
    :return:
    """
    blog = Blog.objects.get(writer__belonging_group__group_id=group_id, blog_ct=blog_ct)
    if Progress.objects.filter(target=blog).exists():
        progress = Progress.objects.get(target=blog)
        return {'status': 'downloading', 'progress': progress.num, 'message': 'downloading'}, status.HTTP_202_ACCEPTED
    else:
        progress = Progress.objects.create(target=blog)
        download_blog_images.delay(progress.id, group_id, blog_ct, blog.writer.ct)
        return {'status': 'start_download', 'progress': progress.num, 'message': 'start download'}, status.HTTP_202_ACCEPTED


def accept_blog_download(group_id, blog_ct):
    """
    Blog詳細をviewする際、そのブログが存在しない時に呼ばれる。 get_blogコマンドを実行。
    :param group_id:
    :param blog_ct:
    :return:
    """
    try:
        subprocess.call(['python', os.path.join(BASE_DIR, 'manage.py'), 'get_blog'])
    except:
        print("subprocess.check_call() failed")

    if Blog.objects.filter(writer__belonging_group__group_id=group_id, blog_ct=blog_ct).exists():
        return accept_image_download(group_id, blog_ct)
    else:
        return {'status': 'blog_not_found', 'message': 'blog not found'}, status.HTTP_200_OK


def delete_image(target_image):
    """
    imageモデルを安全に削除。order等を考慮。同時にファイルも削除。
    :param target_image:
    :return:
    """
    blog = target_image.publisher
    target_image.delete()
    os.remove(str(target_image.picture.path)) # remove file
    images = Image.objects.filter(publisher=blog).order_by('order')
    for i, image in enumerate(images):
        image.order = i
        image.save()


def sort_images(images, order_format, paginate_by, page):
    """
    order_byの引数を生成。
    :param order_format:
    :return: None(have to sort by recommend), images(others)
    """
    if order_format and order_format != 'recommend':
        if order_format == 'newer_post':
            # images = images.order_by('-publisher__post_date', 'publisher__order_for_simul', 'order')
            return images[paginate_by * (page - 1): paginate_by * page]
        elif order_format == 'older_post':
            images = images.order_by('publisher__post_date', '-publisher__order_for_simul', '-order')[paginate_by * (page - 1): paginate_by * page]
        elif order_format == 'dl':
            # images = images.order_by('-num_of_downloads', '-recommend_score', '-score', '-publisher__post_date', 'publisher__order_for_simul')
            images = images.order_by('-num_of_downloads', '-recommend_score')[paginate_by * (page - 1): paginate_by * page]
        elif order_format == 'popularity':
            # images = images.order_by('-score', '-recommend_score', '-publisher__post_date', 'publisher__order_for_simul')
            images = images.order_by('-score', '-recommend_score')[paginate_by * (page - 1): paginate_by * page]
        elif order_format == 'view':
            # images = images.order_by('-num_of_views', '-recommend_score', '-score', '-publisher__post_date', 'publisher__order_for_simul')
            images = images.order_by('-num_of_views', '-recommend_score')[paginate_by * (page - 1): paginate_by * page]
    else:
        return

    # return images
    return images