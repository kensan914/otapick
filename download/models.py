from django.db import models
from search.models import Blog
import os


def get_upload_to(instance, filename):
    return os.path.join('blog_images/',
                        str(instance.publisher.writer.belonging_group.group_id) + '_' +
                        str(instance.publisher.writer.ct),
                        str(instance.publisher.blog_ct),
                        filename,
                        )


class Image(models.Model):
    class Meta:
        db_table = 'image'
        unique_together = ('publisher', 'order')

    order = models.IntegerField(verbose_name='順番')
    picture = models.ImageField(verbose_name='イメージ', upload_to=get_upload_to)
    upload_date = models.DateTimeField(verbose_name='アップロード日', auto_now_add=True)
    publisher = models.ForeignKey(Blog, verbose_name='掲載ブログ', on_delete=models.CASCADE)

    def __str__(self):
        return str(self.publisher.blog_ct) + '/' + str(self.order)
