import os
from billiard.exceptions import SoftTimeLimitExceeded
from celery import shared_task
from rest_framework import status
import otapick
from config.celery import TransactionAwareTask
from config.settings import BASE_DIR
from image.models import Progress, Image
from main.models import Blog
import subprocess


'''
Blog詳細をviewする際、そのブログのプログレスが不十分な時に呼ばれる。ブログは存在している状態。
'''
def accept_image_download(group_id, blog_ct):
    blog = Blog.objects.get(writer__belonging_group__group_id=group_id, blog_ct=blog_ct)
    if Progress.objects.filter(target=blog).exists():
        progress = Progress.objects.get(target=blog)
        return {'status': 'downloading', 'progress': progress.num, 'message': 'downloading'}, status.HTTP_202_ACCEPTED
    else:
        progress = Progress.objects.create(target=blog)
        download_blog_images.delay(progress.id, group_id, blog_ct, blog.writer.ct)
        return {'status': 'start_download', 'progress': progress.num, 'message': 'start download'}, status.HTTP_202_ACCEPTED

'''
Blog詳細をviewする際、そのブログが存在しない時に呼ばれる。
'''
def accept_blog_download(group_id, blog_ct):
    try:
        subprocess.call(['python', os.path.join(BASE_DIR, 'manage.py'), 'keepUpLatest'])
    except:
        print("subprocess.check_call() failed")

    if Blog.objects.filter(writer__belonging_group__group_id=group_id, blog_ct=blog_ct).exists():
        return accept_image_download(group_id, blog_ct)
    else:
        return {'status': 'blog_not_found', 'message': 'blog not found'}, status.HTTP_200_OK


'''
非同期でブログ画像をダウンロード、プログレスの処理まで担当。旧imgScraper.update()
'''
@shared_task(base=TransactionAwareTask, soft_time_limit=60)
def download_blog_images(progress_id, group_id, blog_ct, writer_ct):
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
            img_num = len(img_urls)
            for i, img_url in enumerate(img_urls):
                media = otapick.BlogImageDownloader().download(img_url, group_id, blog_ct, writer_ct)
                if media is not None:
                    if not Image.objects.filter(order=i, publisher=blog).exists():
                        Image.objects.create(
                            order=i,
                            picture=media,
                            publisher=blog,
                        )
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
