from django.db import models


class Group(models.Model):
    class Meta:
        db_table = 'group'

    name = models.CharField(verbose_name='グループ名', max_length=30, unique=True)
    group_id = models.IntegerField(verbose_name='グループID', unique=True)
    netloc = models.CharField(verbose_name='ドメイン', max_length=100, unique=True)

    def __str__(self):
        return self.name


def get_upload_to(instance, filename):
    media_dir_1 = str(instance.belonging_group.group_id) + '_' + str(instance.ct)
    return 'member_images/{0}/{1}'.format(media_dir_1, filename)

class Member(models.Model):
    class Meta:
        db_table = 'member'
        unique_together = ('ct', 'belonging_group')
        ordering = ['belonging_group', 'generation', 'full_kana']

    ct = models.CharField(verbose_name='ct', max_length=10)
    last_kanji = models.CharField(verbose_name='姓_漢', max_length=10)
    first_kanji = models.CharField(verbose_name='名_漢', max_length=10)
    full_kanji = models.CharField(verbose_name='氏名_漢', max_length=20)
    last_kana = models.CharField(verbose_name='姓_かな', max_length=20)
    first_kana = models.CharField(verbose_name='名_かな', max_length=20)
    full_kana = models.CharField(verbose_name='氏名_かな', max_length=40)
    last_eng = models.CharField(verbose_name='姓_英', max_length=30, default='')
    first_eng = models.CharField(verbose_name='名_英', max_length=30, default='')
    full_eng = models.CharField(verbose_name='氏名_英', max_length=50, default='')
    belonging_group = models.ForeignKey(Group, verbose_name='所属グループ', on_delete=models.PROTECT)
    graduate = models.BooleanField(verbose_name='卒業生', default=False)
    independence = models.BooleanField(verbose_name='独立', default=True)
    temporary = models.BooleanField(verbose_name='仮メンバー', default=False)
    generation = models.IntegerField(verbose_name='期', default=1)
    image = models.ImageField(verbose_name='宣材写真', upload_to=get_upload_to, null=True)

    def __str__(self):
        return self.full_kanji


class Blog(models.Model):
    class Meta:
        db_table = 'blog'
        unique_together = ('blog_ct', 'writer')

    blog_ct = models.IntegerField(verbose_name='ブログID')
    title = models.CharField(verbose_name='タイトル', max_length=1000)
    text = models.TextField(verbose_name='本文', max_length=1000000, null=True)
    post_date = models.DateTimeField(verbose_name='投稿日')
    order_for_simul = models.IntegerField(verbose_name='順番(同時投稿用)', default=0)
    writer = models.ForeignKey(Member, verbose_name='メンバー', on_delete=models.PROTECT)
    num_of_downloads = models.IntegerField(verbose_name='総ダウンロード数', default=0)
    num_of_most_downloads = models.IntegerField(verbose_name='最大ダウンロード数', default=0)
    num_of_views = models.IntegerField(verbose_name='閲覧数', default=0)
    v1_per_week = models.IntegerField(verbose_name='閲覧数(1週目)', default=0)
    v2_per_week = models.IntegerField(verbose_name='閲覧数(2週目)', default=0)
    v3_per_week = models.IntegerField(verbose_name='閲覧数(3週目)', default=0)
    score = models.FloatField(verbose_name='スコア(人気順)', default=0)

    def __str__(self):
        return self.title