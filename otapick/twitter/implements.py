import os
from config import settings
from image.models import Image
from main.models import Blog
from otapick.lib.constants import OTAPICK_URL
from otapick.lib.serializerSupport import generate_url, generate_official_url
from otapick.twitter.abstracts import TwitterBot
import emoji


class UpdateBot(TwitterBot):
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
        arrow_double_down = emoji.emojize(':arrow_double_down:', use_aliases=True)
        text += '{}公式{}\n'.format(arrow_double_down, arrow_double_down)
        text += generate_official_url(blog=blog)
        text += '\n'

        # otapick link
        text += '{}もっと見る{}\n'.format(arrow_double_down, arrow_double_down)
        text += '{}{}'.format(OTAPICK_URL, generate_url(blog=blog))
        text += '\n\n'

        # attention
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