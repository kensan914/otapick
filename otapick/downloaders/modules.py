import otapick
from image.models import Progress
from main.models import Blog


def download_images_by(*, member=None, group=None, console=True):
    """
    member,またはgroupごとに未取得の全てのimageを取得。
    ex) otapick.download_images_by(member=member)

    :param member:
    :param group:
    :param console:
    :return: None
    """
    if member is not None:
        blogs = Blog.objects.filter(writer=member)
    elif group is not None:
        blogs = Blog.objects.filter(writer__belonging_group=group)
    else: return

    for blog in blogs:
        if Progress.objects.filter(target=blog).exists():
            progress = Progress.objects.get(target=blog)
            if progress.num < 100 or not progress.ready:
                progress.delete()
            else:
                if console: otapick.console_with_blog_info(blog, 'already saved!!')
                continue

        if not Progress.objects.filter(target=blog).exists():
            progress_instance = Progress.objects.create(target=blog)
            otapick.download_blog_images(progress_instance.id, blog.writer.belonging_group.group_id, blog.blog_ct, blog.writer.ct)
            # progress_instance.num = 100
            # progress_instance.ready = True
            # progress_instance.save()

        if console: otapick.console_with_blog_info(blog, 'saved!!')
