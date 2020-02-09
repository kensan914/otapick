from django.db import models
from search.models import Blog
import os


def get_upload_to(instance, filename):
    media_dir_1 = str(instance.publisher.writer.belonging_group.group_id) + '_' + str(instance.publisher.writer.ct)
    media_dir_2 = str(instance.publisher.blog_ct)
    return 'blog_images/{0}/{1}/{2}' .format(media_dir_1, media_dir_2, filename)

class Image(models.Model):
    class Meta:
        db_table = 'image'
        unique_together = ('publisher_id', 'order')

    order = models.IntegerField(verbose_name='順番')
    picture = models.ImageField(verbose_name='イメージ', upload_to=get_upload_to)
    upload_date = models.DateTimeField(verbose_name='アップロード日', auto_now_add=True)
    # publisher = models.ForeignKey(Blog, verbose_name='掲載ブログ', on_delete=models.CASCADE)
    publisher_id = models.IntegerField(verbose_name='掲載ブログID', null=True)

    def __str__(self):
        return str(Blog.objects.get(id=self.publisher_id).blog_ct) + '/' + str(self.order)


class Progress(models.Model):
    class Meta:
        db_table = 'progress'

    num = models.IntegerField(verbose_name='進捗', default=0, null=True)
    ready = models.BooleanField(default=False)
    # target = models.OneToOneField(Blog, verbose_name='対象ブログ', on_delete=models.CASCADE, null=True, unique=True)
    target_id = models.IntegerField(verbose_name='対象ブログID', null=True, unique=True)
    def __str__(self):
        return Blog.objects.get(id=self.target_id).title
