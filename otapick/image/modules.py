import os
import shutil
import otapick
from image.models import Image
from main.models import Blog


def compress_blog_image(image):
    """
    image単位で500xと250x、2つの圧縮imageを作成。
    :param image:
    :return:
    """
    base_dir_path = os.path.dirname(str(image.picture.path)) # /www/var/otapick/media/blog_images/1_07/9244
    dir_path_250x = os.path.join(base_dir_path, '250x') # /www/var/otapick/media/blog_images/1_07/9244/250x
    dir_path_500x = os.path.join(base_dir_path, '500x') # /www/var/otapick/media/blog_images/1_07/9244/500x
    os.makedirs(dir_path_250x, exist_ok=True)
    os.makedirs(dir_path_500x, exist_ok=True)

    base_file_name = os.path.basename(str(image.picture.path)) # sample.jpg
    path_250x = os.path.join(dir_path_250x, base_file_name) # /www/var/otapick/media/blog_images/1_07/9244/250x/sample.jpg
    path_500x = os.path.join(dir_path_500x, base_file_name) # /www/var/otapick/media/blog_images/1_07/9244/500x/sample.jpg

    ### copy file => 250x, 500x ###
    if os.path.isfile(str(image.picture.path)):
        shutil.copyfile(str(image.picture.path), path_250x)
        shutil.copyfile(str(image.picture.path), path_500x)

    ### execute compress ###
    otapick.ImageCompressor().edit(path_250x, width=250)
    otapick.ImageCompressor().edit(path_500x, width=500)

    ### define media ###
    base_dir_media = os.path.dirname(str(image.picture)) # blog_images/1_07/9244/
    dir_min_250x = os.path.join('250x', base_file_name) # /250x/sample.jpg
    dir_min_500x = os.path.join('500x', base_file_name) # /500x/sample.jpg
    media_250x = os.path.join(base_dir_media, dir_min_250x) # blog_images/1_07/9244/250x/sample.jpg
    media_500x = os.path.join(base_dir_media, dir_min_500x) # blog_images/1_07/9244/500x/sample.jpg

    ### register media ###
    image.picture_250x = media_250x
    image.picture_500x = media_500x
    image.save()


def compress_blog_images_by(*, member=None, group=None, console=True):
    """
    member,またはgroupごとに取得済みの全てのimageの500xと250xを作成。
    ex) otapick.download_images_by(member=member)

    :param member:
    :param group:
    :param console:
    :return: None
    """
    if member is not None:
        blogs = Blog.objects.filter(writer=member)
    elif group is not None:
        blogs = Blog.objects.filter(publishing_group=group)
    else: return

    for blog in blogs:
        images = Image.objects.filter(publisher=blog)
        if images.exists():
            for image in images:
                if not bool(image.picture_250x) or not bool(image.picture_500x):
                    compress_blog_image(image)
            if console: otapick.console_with_blog_info(blog, 'compressed!!')
        else:
            if console: otapick.console_with_blog_info(blog, 'image not found!!')
