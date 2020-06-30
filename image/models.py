from django.db import models
from main.models import Blog


def get_upload_to(instance, filename):
    media_dir_1 = str(instance.publisher.writer.belonging_group.group_id) + '_' + str(instance.publisher.writer.ct)
    media_dir_2 = str(instance.publisher.blog_ct)
    return 'blog_images/{0}/{1}/{2}' .format(media_dir_1, media_dir_2, filename)


def get_thumbnail_upload_to(instance, filename):
    media_dir_1 = str(instance.publisher.writer.belonging_group.group_id) + '_' + str(instance.publisher.writer.ct)
    media_dir_2 = str(instance.publisher.blog_ct)
    return 'blog_thumbnail/{0}/{1}/{2}'.format(media_dir_1, media_dir_2, filename)


class Image(models.Model):
    class Meta:
        db_table = 'image'
        unique_together = ('publisher', 'order')

    order = models.IntegerField(verbose_name='順番')
    picture = models.ImageField(verbose_name='イメージ(original)', upload_to=get_upload_to)
    picture_250x = models.ImageField(verbose_name='イメージ(250x)', null=True)
    picture_500x = models.ImageField(verbose_name='イメージ(500x)', null=True)
    upload_date = models.DateTimeField(verbose_name='アップロード日', auto_now_add=True)
    publisher = models.ForeignKey(Blog, verbose_name='掲載ブログ', on_delete=models.CASCADE)
    num_of_downloads = models.IntegerField(verbose_name='ダウンロード数', default=0)
    d1_per_week = models.IntegerField(verbose_name='ダウンロード数(1週目)', default=0)
    num_of_views = models.IntegerField(verbose_name='閲覧数', default=0)
    v1_per_week = models.IntegerField(verbose_name='閲覧数(1週目)', default=0)
    v2_per_week = models.IntegerField(verbose_name='閲覧数(2週目)', default=0)
    v3_per_week = models.IntegerField(verbose_name='閲覧数(3週目)', default=0)

    def __str__(self):
        return str(self.publisher.title) + '/' + str(self.order)


class Progress(models.Model):
    class Meta:
        db_table = 'progress'

    num = models.IntegerField(verbose_name='進捗', default=0, null=True)
    ready = models.BooleanField(default=False)
    target = models.OneToOneField(Blog, verbose_name='対象ブログ', on_delete=models.CASCADE, null=True, unique=True)

    def __str__(self):
        return self.target.title


class Thumbnail(models.Model):
    class Meta:
        db_table = 'thumbnail'

    picture = models.ImageField(verbose_name='イメージ', upload_to=get_thumbnail_upload_to)
    publisher = models.OneToOneField(Blog, verbose_name='掲載ブログ', on_delete=models.CASCADE)

    def __str__(self):
        return self.publisher.title
