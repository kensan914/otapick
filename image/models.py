from django.db import models
from account.models import Account
from main.models import Blog


def get_upload_to(instance, filename):
    media_dir_1 = str(instance.publisher.writer.belonging_group.group_id) + '_' + str(instance.publisher.writer.ct)
    media_dir_2 = str(instance.publisher.blog_ct)
    return 'blog_images/{0}/{1}/{2}' .format(media_dir_1, media_dir_2, filename)


def get_thumbnail_upload_to(instance, filename):
    pass


class Image(models.Model):
    class Meta:
        db_table = 'image'
        unique_together = ('publisher', 'order')
        indexes = [
            models.Index(fields=['-publisher', 'order'], name='newer_post'),
            models.Index(fields=['-num_of_downloads', '-recommend_score'], name='dl'),
            models.Index(fields=['-score', '-recommend_score'], name='popularity'),
            models.Index(fields=['-num_of_views', '-recommend_score'], name='view'),
        ]
        ordering = ['-publisher__post_date', 'publisher__order_for_simul', 'order']

    order = models.IntegerField(verbose_name='順番')
    picture = models.ImageField(verbose_name='イメージ(original)', upload_to=get_upload_to)
    picture_250x = models.ImageField(verbose_name='イメージ(250x)', null=True)
    picture_500x = models.ImageField(verbose_name='イメージ(500x)', null=True)
    upload_date = models.DateTimeField(verbose_name='アップロード日', auto_now_add=True)
    publisher = models.ForeignKey(Blog, verbose_name='掲載ブログ', on_delete=models.CASCADE)
    num_of_downloads = models.IntegerField(verbose_name='ダウンロード数', default=0)
    d1_per_day = models.IntegerField(verbose_name='ダウンロード数(1日)', default=0)
    num_of_views = models.IntegerField(verbose_name='閲覧数', default=0)
    v1_per_day = models.IntegerField(verbose_name='閲覧数(1日目)', default=0)
    v2_per_day = models.IntegerField(verbose_name='閲覧数(2日目)', default=0)
    v3_per_day = models.IntegerField(verbose_name='閲覧数(3日目)', default=0)
    score = models.FloatField(verbose_name='スコア(人気順)', default=0)
    changed = models.BooleanField(verbose_name='変更有(スコア計算用)', default=0)
    recommend_score = models.FloatField(verbose_name='スコア(おすすめ順）', default=False)

    def __str__(self):
        return str(self.publisher.title) + '/' + str(self.order)


class Favorite(models.Model):
    class Meta:
        db_table = 'favorite'
        ordering = ['-created_at']
        unique_together = ('image', 'user')

    image = models.ForeignKey(Image, verbose_name='画像', on_delete=models.CASCADE)
    user = models.ForeignKey(Account, verbose_name='ユーザ', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='追加日')

    def __str__(self):
        return '{}({})'.format(str(self.user.name), str(self.created_at))
