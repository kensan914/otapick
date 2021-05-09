import os
import shutil
from django.core.management.base import BaseCommand
import otapick
from image.models import Image
from PIL import Image as PilImage
from tqdm import tqdm


class Command(BaseCommand):
    help = '全てのImageをメンテナンス。↓メンテナンス内容' \
           '1. ファイル名が無いドットファイルにファイル名を与える。(.jpg⇒_.jpg)' \
           '2. gifファイルを排除' \
           '3. 不完全な画像ファイルの場合、そのブログの画像をDLしなおし圧縮も合わせて行う。(閲覧数などは変化しない)'

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        images = Image.objects.all()
        bar = tqdm(total=images.count())
        blogImageCrawler = otapick.BlogImageCrawler()
        blogImageDownloader = otapick.BlogImageDownloader()

        for image in images:
            # ファイル名が無いドットファイルにファイル名を与える。(.jpg⇒_.jpg)
            if os.path.basename(str(image.picture)).startswith('.'):
                dir_name = os.path.dirname(
                    str(image.picture))  # blog_images/1_07/9244
                # blog_images/1_07/9244/_.jpg
                file_path = os.path.join(
                    dir_name, '_' + os.path.basename(str(image.picture)))

                # /www/var/otapick/media/blog_images/1_07/9244
                full_dir_name = os.path.dirname(str(image.picture.path))
                # /www/var/otapick/media/blog_images/1_07/9244/_.jpg
                full_file_path = os.path.join(
                    full_dir_name, '_' + os.path.basename(str(image.picture)))

                shutil.move(image.picture.path, full_file_path)
                image.picture = file_path
                image.save()
                print(str(image.publisher.title) + '/' +
                      str(image.order), 'resolve .file!!')

            # gifファイルを排除
            if os.path.splitext(str(image.picture))[1] == '.gif':
                otapick.delete_image(image)
                print(str(image.publisher.title) + '/' +
                      str(image.order), 'resole gif file!!')

            # 不完全な画像ファイルの場合、そのブログの画像をDLしなおし圧縮も合わせて行う。
            try:
                # 250x・500xがどちらか1つでも欠陥であったら
                if not(bool(image.picture_250x) and bool(image.picture_500x)):
                    raise Exception("250x・500x error")

                # PilImageによりopenできるか検査
                pil_image = PilImage.open(image.picture.path)
                pil_image.verify()
                bar.update(1)
            except:
                group_id = image.publisher.publishing_group.group_id
                group_key = image.publisher.publishing_group.key
                blog_ct = image.publisher.blog_ct
                writer_ct = image.publisher.writer.ct

                image_url_list = blogImageCrawler.crawl(
                    group_key=group_key, blog_ct=blog_ct)
                if image_url_list is None:
                    print(str(image.publisher.title) + '/' +
                          str(image.order), 'は不完全でしたが、公式の掲載ブログにアクセスできません。')
                    bar.update(1)
                    continue

                image_url = image_url_list[image.order]
                media = blogImageDownloader.download(
                    image_url, group_id, blog_ct, writer_ct)
                if media == 'not_image':  # exclude gif
                    print(str(image.publisher.title) + '/' +
                          str(image.order), 'は不完全でしたが、公式の画像にアクセスできません。')
                    bar.update(1)
                    continue
                elif media is not None:
                    # set width & height
                    w, h = otapick.get_image_w_h(image)
                    image.width = w
                    image.height = h
                    image.save()
                else:
                    bar.update(1)
                    import traceback
                    traceback.print_exc()

                otapick.compress_blog_image(image)
                print(str(image.publisher.title) + '/' +
                      str(image.order), 'resolve incomplete file!!')
                bar.update(1)
