from image.models import Image
from main.models import Blog


def shift_score(blogs=None, images=None, order=True):
    """
    blogかimageを渡して、 score関連のフィールド値を一日ずらす。
    order:: Trueで過去方向にずらす。
    """
    if blogs is not None:
        objects = blogs
        model = Blog
    elif images is not None:
        objects = images
        model = Image
    else:
        objects = None
        model = None

    if objects is not None:
        if order:
            objects = objects.exclude(v1_per_day=0, v2_per_day=0, v3_per_day=0)
            update_record = []
            for obj in objects:
                obj.v3_per_day = obj.v2_per_day
                obj.v2_per_day = obj.v1_per_day
                obj.v1_per_day = 0
                obj.changed = True
                update_record.append(obj)
                if len(update_record) > 500:  # 最後に一気にbulk_updateするとMySQLとの接続時間が長いと怒られるため対処
                    model.objects.bulk_update(update_record,
                                              fields=['v1_per_day', 'v2_per_day', 'v3_per_day', 'changed'])
                    update_record = []
            model.objects.bulk_update(update_record, fields=[
                                      'v1_per_day', 'v2_per_day', 'v3_per_day', 'changed'])
        else:
            objects = objects.exclude(v2_per_day=0, v3_per_day=0)
            update_record = []
            for obj in objects:
                obj.v1_per_day = obj.v2_per_day
                obj.v2_per_day = obj.v3_per_day
                obj.v3_per_day = 0
                obj.changed = True
                update_record.append(obj)
                if len(update_record) > 500:
                    model.objects.bulk_update(update_record,
                                              fields=['v1_per_day', 'v2_per_day', 'v3_per_day', 'changed'])
                    update_record = []
            model.objects.bulk_update(update_record, fields=[
                                      'v1_per_day', 'v2_per_day', 'v3_per_day', 'changed'])
    if images is not None:
        images = images.exclude(d1_per_day=0)
        update_record = []
        for image in images:
            image.d1_per_day = 0
            image.changed = True
            image.save()
        model.objects.bulk_update(update_record, fields=[
                                  'd1_per_day', 'changed'])


def increment_num_of_views(blog=None, image=None, num=0):
    """
    blogかimageを渡して、numだけnum_of_viewsを増やす
    """
    if blog is not None:
        blog.num_of_views += num
        blog.v1_per_day += num
        blog.changed = True
        blog.save()
    elif image is not None:
        image.num_of_views += num
        image.v1_per_day += num
        image.changed = True
        image.save()


def increment_num_of_downloads(images, blog, num):
    """
    引数にimage、またはそのリストとpublisherを渡す。numだけnum_of_downloadsを増やす
    """
    if hasattr(images, '__iter__'):
        for image in images:
            image.num_of_downloads += num
            image.d1_per_day += num
            image.changed = True
            image.save()
    else:
        images.num_of_downloads += num
        images.d1_per_day += num
        images.changed = True
        images.save()

    total_num_of_downloads = 0
    for image in Image.objects.filter(publisher=blog):
        total_num_of_downloads += image.num_of_downloads
    blog.num_of_downloads = total_num_of_downloads
    blog.save()


def edit_num_of_most_downloads(blog):
    """
    blogのnum_of_most_downloadsを更新。
    """
    blog.num_of_most_downloads = Image.objects.filter(
        publisher=blog).order_by('-num_of_downloads')[0].num_of_downloads
    blog.save()
