from django.db import models


class Group(models.Model):
    class Meta:
        db_table = 'group'

    name = models.CharField(verbose_name='グループ名', max_length=30, unique=True)
    group_id = models.IntegerField(verbose_name='グループID', unique=True)
    netloc = models.CharField(verbose_name='ドメイン', max_length=100, unique=True)

    def __str__(self):
        return self.name


class Member(models.Model):
    class Meta:
        db_table = 'member'
        unique_together = ('ct', 'belonging_group')

    ct = models.IntegerField(verbose_name='ct')
    last_kanji = models.CharField(verbose_name='姓_漢', max_length=10)
    first_kanji = models.CharField(verbose_name='名_漢', max_length=10)
    full_kanji = models.CharField(verbose_name='氏名_漢', max_length=20)
    last_kana = models.CharField(verbose_name='姓_かな', max_length=20)
    first_kana = models.CharField(verbose_name='名_かな', max_length=20)
    full_kana = models.CharField(verbose_name='氏名_かな', max_length=40)
    belonging_group = models.ForeignKey(Group, verbose_name='所属グループ', on_delete=models.PROTECT)

    def __str__(self):
        return self.full_kanji


class Blog(models.Model):
    class Meta:
        db_table = 'blog'

    blog_ct = models.IntegerField(verbose_name='ブログID', unique=True)
    title = models.CharField(verbose_name='タイトル', max_length=100)
    text = models.TextField(verbose_name='本文', max_length=10000)
    post_date = models.DateField(verbose_name='投稿日')
    writer = models.ForeignKey(Member, verbose_name='メンバー', on_delete=models.PROTECT)

    def __str__(self):
        return self.title