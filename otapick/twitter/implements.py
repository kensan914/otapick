import os
from config import settings
from image.models import Image
from main.models import Blog
from otapick import sort_images
from otapick.lib.constants import OTAPICK_URL
from otapick.extensions.serializers_ex import generate_url, generate_official_url
from otapick.twitter.abstracts import TwitterBot
import emoji
from otapick.twitter.generics import RankBot
from urllib.parse import urljoin


class UpdateBot(TwitterBot):
    """ UpdateBot
    ブログの更新情報をtweet。インタフェースは、tweet()メソッド。引数にgroup_id, blog_ct。
    """

    def create_text(self, **kwargs):
        blog = kwargs['blog']
        text = ''

        # headline
        text += self.group_emoji
        text += '坂道ブログ更新通知'
        text += emoji.emojize(':rainbow:', use_aliases=True)
        text += '\n\n'

        # blog title
        text += '【タイトル】{}\n'.format(self.shorten_text(blog.title,
                                                      max_length=30))

        # writer
        text += '【メンバー】#{}\n'.format(self.shorten_text(
            blog.writer.full_kanji, max_length=10))

        # belonging group
        text += '【グループ】#{}\n\n'.format(self.shorten_text(
            blog.writer.belonging_group.name, max_length=10))

        # official link
        text += self.generate_link('公式', generate_official_url(blog=blog))

        # otapick link
        text += self.generate_link('もっと見る',
                                   urljoin(OTAPICK_URL, generate_url(blog=blog)))
        text += '\n'

        # attention
        if Image.objects.filter(publisher=blog).exists():
            text += '※下記の画像は圧縮されているため、当サイトでの保存を推奨します。\n'

        return text

    def create_media_urls(self, **kwargs):
        blog = kwargs['blog']
        media_urls = []

        if Image.objects.filter(publisher=blog).exists():
            for image in Image.objects.filter(publisher=blog).order_by('order')[:4]:
                try:
                    media_path = str(image.picture)
                    media_url = os.path.join(settings.MEDIA_ROOT, media_path)
                    media_urls.append(media_url)
                except:
                    pass
        return media_urls

    def tweet(self, group_id, blog_ct):
        self.set_group_id(group_id)
        blogs = Blog.objects.filter(
            publishing_group__group_id=group_id, blog_ct=blog_ct)
        if blogs.exists():
            blog = blogs.first()
            return super().tweet(blog=blog)
        else:
            return


class PopularityBot(RankBot):
    """ PopularityBot
    score更新時、人気上位3位をtweet。インタフェースは、tweet()メソッド。引数にgroup_id。
    """

    def tweet(self, group_id):
        self.images = sort_images(Image.objects.filter(
            publisher__publishing_group__group_id=group_id), 'popularity')[:3]
        self.rank_type_emoji = emoji.emojize(':crown:', use_aliases=True)
        self.set_group_id(group_id)
        self.headline_title = '現在人気の画像'
        self.pictures = self.images.values_list('picture', flat=True)
        self.otapick_link = urljoin(
            OTAPICK_URL, 'images/{}?sort=popularity'.format(group_id))

        return super().tweet(images=self.images)


class ViewBot(RankBot):
    """ ViewBot
    閲覧数上位3位をtweet. インタフェースは、tweet()メソッド. 引数にgroup_id, blog_or_image, today.
    """

    def tweet(self, group_id, blog_or_image, today):
        self.rank_type_emoji = emoji.emojize(':eyes:', use_aliases=True)
        self.set_group_id(group_id)

        if blog_or_image == 'image':
            if today:
                self.images = Image.objects.filter(publisher__writer__belonging_group__group_id=group_id).order_by(
                    '-v1_per_day', '-recommend_score', '-score')[:2]
                self.headline_title = '今日最も閲覧された画像'
            else:
                self.images = Image.objects.filter(publisher__writer__belonging_group__group_id=group_id).order_by(
                    '-v2_per_day', '-recommend_score', '-score')[:2]
                self.headline_title = '昨日最も閲覧された画像'
            self.pictures = self.images.values_list('picture', flat=True)

            return super().tweet(images=self.images)
        elif blog_or_image == 'blog':
            if today:
                self.blogs = Blog.objects.filter(writer__belonging_group__group_id=group_id).order_by(
                    '-v1_per_day', '-recommend_score', '-score')[:2]
                self.headline_title = '今日最も閲覧されたブログ'
            else:
                self.blogs = Blog.objects.filter(writer__belonging_group__group_id=group_id).order_by(
                    '-v2_per_day', '-recommend_score', '-score')[:2]
                self.headline_title = '昨日最も閲覧されたブログ'
            for blog in self.blogs:
                if Image.objects.filter(publisher=blog).exists():
                    self.pictures.append(Image.objects.get(
                        publisher=blog, order=0).picture)
            return super().tweet(blogs=self.blogs)
        else:
            return


class DLBot(RankBot):
    """ DLBot
    DL数上位3位をtweet. インタフェースは、tweet()メソッド. 引数にgroup_id.
    """

    def tweet(self, group_id):
        self.rank_type_emoji = emoji.emojize(':inbox_tray:', use_aliases=True)
        self.set_group_id(group_id)
        self.images = Image.objects.filter(publisher__writer__belonging_group__group_id=group_id).order_by(
            '-d1_per_day', '-recommend_score', '-score')[:2]
        self.headline_title = '今日最もダウンロードされた画像'
        self.pictures = self.images.values_list('picture', flat=True)
        return super().tweet(images=self.images)
