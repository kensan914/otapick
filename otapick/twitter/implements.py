import os
from config import settings
from image.models import Image
from main.models import Blog, Group
from otapick import sort_blogs, sort_images
from otapick.lib.constants import OTAPICK_URL
from otapick.lib.serializerSupport import generate_url, generate_official_url
from otapick.twitter.abstracts import TwitterBot
import emoji


class UpdateBot(TwitterBot):
    """ UpdateBot
    ブログの更新情報をtweet。インタフェースは、tweet()メソッド。引数にgroup_id, blog_ct。
    """
    def create_text(self, **kwargs):
        blog = kwargs['blog']
        text = ''

        # headline
        if blog.writer.belonging_group.group_id == 1:
            text += emoji.emojize(':deciduous_tree:', use_aliases=True)
        elif blog.writer.belonging_group.group_id == 2:
            text += emoji.emojize(':sun_with_face:', use_aliases=True)
        text += '坂道ブログ更新通知'
        text += emoji.emojize(':rainbow:', use_aliases=True)
        text += '\n\n'

        # blog title
        text += '【タイトル】{}\n'.format(self.shorten_text(blog.title, max_length=30))

        # writer
        text += '【メンバー】#{}\n'.format(self.shorten_text(blog.writer.full_kanji, max_length=10))

        # belonging group
        text += '【グループ】#{}\n\n'.format(self.shorten_text(blog.writer.belonging_group.name, max_length=10))

        # official link
        text += self.generate_link('公式', generate_official_url(blog=blog))

        # otapick link
        text += self.generate_link('もっと見る', OTAPICK_URL + generate_url(blog=blog))
        text += '\n'

        # attention
        if Image.objects.filter(publisher=blog).exists():
            text += '※下記の画像は圧縮されているため、当サイトでの保存を推奨します。\n'

        return text

    def create_media_urls(self, **kwargs):
        blog = kwargs['blog']
        media_urls = []

        if Image.objects.filter(publisher=blog).exists():
            for image in Image.objects.filter(publisher=blog).order_by('order'):
                try:
                    media_path = str(image.picture)
                    media_url = os.path.join(settings.MEDIA_ROOT, media_path)
                    media_urls.append(media_url)
                except:
                    pass
        return media_urls

    def tweet(self, group_id, blog_ct):
        if Blog.objects.filter(writer__belonging_group__group_id=group_id, blog_ct=blog_ct).exists():
            blog = Blog.objects.get(writer__belonging_group__group_id=group_id, blog_ct=blog_ct)
            return super().tweet(blog = blog)
        else:
            return


class PopularityBot(TwitterBot):
    """ UpdateBot
    score更新時、人気上位3位をtweet。インタフェースは、tweet()メソッド。引数にgroup_id。
    """
    def create_text(self, **kwargs):
        images = kwargs['images']
        group_id = kwargs['group_id']
        text = ''

        # headline
        crown = emoji.emojize(':crown:', use_aliases=True)
        group_emoji = None
        if group_id == 1:
            group_emoji = emoji.emojize(':deciduous_tree:', use_aliases=True)
        elif group_id == 2:
            group_emoji = emoji.emojize(':sun_with_face:', use_aliases=True)

        text += '{}{}{}\n'.format(crown, group_emoji, crown)
        text += '現在人気の画像(#{} )'.format(Group.objects.get(group_id=group_id).name)
        text += '{}{}{}\n'.format(crown, group_emoji, crown)
        text += '\n'

        # ranking
        for i, image in enumerate(images):
            if i == 0:
                text += emoji.emojize(':1st_place_medal:', use_aliases=True)
            elif i == 1:
                text += emoji.emojize(':2nd_place_medal:', use_aliases=True)
            elif i == 2:
                text += emoji.emojize(':3rd_place_medal:', use_aliases=True)
            text += '「{}」#{}\n'.format(self.shorten_text(image.publisher.title, max_length=10), self.shorten_text(image.publisher.writer.full_kanji, max_length=10))
        text += '\n'

        # otapick link
        text += self.generate_link('もっと見る', '{}/images/{}?sort=popularity'.format(OTAPICK_URL, group_id))
        text += '\n'

        # attention
        if images.exists():
            text += '※下記の画像は圧縮されているため、当サイトでの保存を推奨します。\n'

        return text

    def create_media_urls(self, **kwargs):
        images = kwargs['images']
        media_urls = []

        for image in images:
            try:
                media_path = str(image.picture)
                media_url = os.path.join(settings.MEDIA_ROOT, media_path)
                media_urls.append(media_url)
            except:
                pass
        return media_urls

    def tweet(self, group_id):
        images = sort_images(Image.objects.filter(publisher__writer__belonging_group__group_id=group_id), 'popularity')[:3]
        return super().tweet(images=images, group_id=group_id)
