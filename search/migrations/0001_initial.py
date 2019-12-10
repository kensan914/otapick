# Generated by Django 3.0 on 2019-12-10 19:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30, unique=True, verbose_name='グループ名')),
                ('group_id', models.IntegerField(unique=True, verbose_name='グループID')),
                ('netloc', models.CharField(max_length=100, unique=True, verbose_name='ドメイン')),
            ],
            options={
                'db_table': 'group',
            },
        ),
        migrations.CreateModel(
            name='Member',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ct', models.IntegerField(verbose_name='ct')),
                ('last_kanji', models.CharField(max_length=10, verbose_name='姓_漢')),
                ('first_kanji', models.CharField(max_length=10, verbose_name='名_漢')),
                ('full_kanji', models.CharField(max_length=20, verbose_name='氏名_漢')),
                ('last_kana', models.CharField(max_length=20, verbose_name='姓_かな')),
                ('first_kana', models.CharField(max_length=20, verbose_name='名_かな')),
                ('full_kana', models.CharField(max_length=40, verbose_name='氏名_かな')),
                ('belonging_group', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='search.Group', verbose_name='所属グループ')),
            ],
            options={
                'db_table': 'member',
                'unique_together': {('ct', 'belonging_group')},
            },
        ),
        migrations.CreateModel(
            name='Blog',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('blog_ct', models.IntegerField(unique=True, verbose_name='ブログID')),
                ('title', models.CharField(max_length=100, verbose_name='タイトル')),
                ('text', models.TextField(max_length=10000, verbose_name='本文')),
                ('post_date', models.DateField(verbose_name='投稿日')),
                ('writer', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='search.Member', verbose_name='メンバー')),
            ],
            options={
                'db_table': 'blog',
            },
        ),
    ]
