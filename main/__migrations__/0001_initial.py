# Generated by Django 3.0.5 on 2021-04-22 21:22

from django.db import migrations, models
import django.db.models.deletion
import main.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('group_id', models.IntegerField(unique=True, verbose_name='グループID')),
                ('name', models.CharField(max_length=30, verbose_name='グループ名')),
                ('domain', models.CharField(max_length=100, verbose_name='ドメイン')),
                ('key', models.CharField(blank=True, max_length=30, verbose_name='キー')),
                ('is_active', models.BooleanField(default=True, verbose_name='活動状況')),
                ('blog_list_paginate_by', models.IntegerField(default=20, verbose_name='(PC)公式ブログの1ページ当たりのブログ件数')),
                ('blog_list_paginate_by_mobile', models.IntegerField(default=20, verbose_name='(Mobile)公式ブログの1ページ当たりのブログ件数')),
                ('latest_list_paginate_by', models.IntegerField(default=12, verbose_name='(PC)公式最新ブログリストのブログ件数')),
                ('latest_list_paginate_by_mobile', models.IntegerField(default=12, verbose_name='(Mobile)公式最新ブログリストのブログ件数')),
                ('blog_url_format', models.CharField(blank=True, max_length=200, verbose_name='公式ブログ詳細ページURIフォーマット(blog_ctを表す{}を一つ含む)')),
                ('member_url_format', models.CharField(blank=True, max_length=200, verbose_name='メンバー詳細ページURIフォーマット(member_ctを表す{}を一つ含む)')),
            ],
            options={
                'verbose_name': 'グループ',
                'verbose_name_plural': 'グループ',
                'db_table': 'group',
                'ordering': ['group_id'],
            },
        ),
        migrations.CreateModel(
            name='Member',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ct', models.CharField(max_length=10, verbose_name='ct')),
                ('last_kanji', models.CharField(max_length=10, verbose_name='姓_漢')),
                ('first_kanji', models.CharField(max_length=10, verbose_name='名_漢')),
                ('full_kanji', models.CharField(max_length=20, verbose_name='氏名_漢')),
                ('last_kana', models.CharField(max_length=20, verbose_name='姓_かな')),
                ('first_kana', models.CharField(max_length=20, verbose_name='名_かな')),
                ('full_kana', models.CharField(max_length=40, verbose_name='氏名_かな')),
                ('last_eng', models.CharField(default='', max_length=30, verbose_name='姓_英')),
                ('first_eng', models.CharField(default='', max_length=30, verbose_name='名_英')),
                ('full_eng', models.CharField(default='', max_length=50, verbose_name='氏名_英')),
                ('graduate', models.BooleanField(default=False, verbose_name='卒業生')),
                ('independence', models.BooleanField(default=True, verbose_name='独立')),
                ('temporary', models.BooleanField(default=False, verbose_name='仮メンバー')),
                ('generation', models.IntegerField(default=1, verbose_name='期')),
                ('image', models.ImageField(null=True, upload_to=main.models.get_upload_to, verbose_name='宣材写真')),
                ('belonging_group', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='main.Group', verbose_name='所属グループ')),
            ],
            options={
                'verbose_name': 'メンバー',
                'verbose_name_plural': 'メンバー',
                'db_table': 'member',
                'ordering': ['belonging_group', 'generation', 'full_kana'],
                'unique_together': {('ct', 'belonging_group')},
            },
        ),
        migrations.CreateModel(
            name='Blog',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('blog_ct', models.IntegerField(verbose_name='ブログID')),
                ('title', models.CharField(max_length=1000, verbose_name='タイトル')),
                ('text', models.TextField(max_length=1000000, null=True, verbose_name='本文')),
                ('post_date', models.DateTimeField(verbose_name='投稿日')),
                ('order_for_simul', models.IntegerField(default=0, verbose_name='順番(同時投稿用)')),
                ('num_of_downloads', models.IntegerField(default=0, verbose_name='総ダウンロード数')),
                ('num_of_most_downloads', models.IntegerField(default=0, verbose_name='最大ダウンロード数')),
                ('num_of_views', models.IntegerField(default=0, verbose_name='閲覧数')),
                ('v1_per_day', models.IntegerField(default=0, verbose_name='閲覧数(1日目)')),
                ('v2_per_day', models.IntegerField(default=0, verbose_name='閲覧数(2日目)')),
                ('v3_per_day', models.IntegerField(default=0, verbose_name='閲覧数(3日目)')),
                ('score', models.FloatField(default=0, verbose_name='スコア(人気順)')),
                ('changed', models.BooleanField(default=0, verbose_name='変更有(スコア計算用)')),
                ('recommend_score', models.FloatField(default=0, verbose_name='スコア(おすすめ順）')),
                ('publishing_group', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='main.Group', verbose_name='掲載グループ')),
                ('writer', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='main.Member', verbose_name='メンバー')),
            ],
            options={
                'verbose_name': 'ブログ',
                'verbose_name_plural': 'ブログ',
                'db_table': 'blog',
                'ordering': ['post_date', 'order_for_simul'],
                'unique_together': {('blog_ct', 'writer')},
            },
        ),
    ]
