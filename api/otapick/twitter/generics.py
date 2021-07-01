import os
from abc import ABC, abstractmethod
import emoji
from config import settings
from api.models.main.models import Group
from api.otapick.lib.constants import OTAPICK_URL
from api.otapick.twitter.abstracts import TwitterBot
from urllib.parse import urljoin


class RankBot(TwitterBot, ABC):
    rank_type_emoji = emoji.emojize(":crown:", use_aliases=True)
    headline_title = ""
    blogs = []
    images = []
    otapick_link = ""
    pictures = []

    def create_text(self, **kwargs):
        text = ""

        # headline
        text += "{}{}{}\n".format(
            self.rank_type_emoji, self.group_emoji, self.rank_type_emoji
        )
        text += "{}(#{} )\n".format(
            self.headline_title, Group.objects.get(group_id=self.group_id).name
        )
        text += "{}{}{}\n".format(
            self.rank_type_emoji, self.group_emoji, self.rank_type_emoji
        )
        text += "\n"

        # ranking
        fast_forward = emoji.emojize(":fast_forward:", use_aliases=True)
        if len(self.blogs) > 0:
            for i, blog in enumerate(self.blogs):
                text += self.generate_medal_emoji(rank=i + 1)
                text += "「{}」#{}\n".format(
                    self.shorten_text(blog.title, max_length=10),
                    self.shorten_text(blog.writer.full_kanji, max_length=10),
                )
                if self.otapick_link == "":
                    text += "{}保存{}{}\n\n".format(
                        fast_forward,
                        fast_forward,
                        urljoin(
                            OTAPICK_URL,
                            "blog/{}/{}/".format(self.group_id, blog.blog_ct),
                        ),
                    )
        elif len(self.images) > 0:
            for i, image in enumerate(self.images):
                text += self.generate_medal_emoji(rank=i + 1)
                text += "「{}」#{}\n".format(
                    self.shorten_text(image.publisher.title, max_length=10),
                    self.shorten_text(image.publisher.writer.full_kanji, max_length=10),
                )
                if self.otapick_link == "":
                    text += "{}保存{}{}\n\n".format(
                        fast_forward,
                        fast_forward,
                        urljoin(
                            OTAPICK_URL,
                            "image/{}/{}/{}/".format(
                                self.group_id, image.publisher.blog_ct, image.order
                            ),
                        ),
                    )
        text += "\n"

        # otapick link
        if self.otapick_link != "":
            text += self.generate_link("もっと見る", self.otapick_link)
            text += "\n"

        text += "#ヲタピック\n"

        return text

    def create_media_urls(self, **kwargs):
        media_urls = []
        for picture in self.pictures:
            try:
                media_path = str(picture)
                media_url = os.path.join(settings.MEDIA_ROOT, media_path)
                media_urls.append(media_url)
            except:
                pass
        return media_urls

    @abstractmethod
    def tweet(self, **kwargs):
        return super().tweet(**kwargs)
