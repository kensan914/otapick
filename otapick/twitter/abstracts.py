from abc import ABCMeta, abstractmethod
import tweepy
from otapick.lib.constants import TWITTER_CK, TWITTER_CS, TWITTER_AT, TWITTER_AS
import emoji

class TwitterBot(metaclass=ABCMeta):
    def __init__(self):
        auth = tweepy.OAuthHandler(TWITTER_CK, TWITTER_CS)
        auth.set_access_token(TWITTER_AT, TWITTER_AS)
        self.api = tweepy.API(auth)
        self.group_id = 0
        self.group_emoji = None

    @abstractmethod
    def create_text(self, **kwargs):
        """
        表示するtextを作成し、return
        :param kwargs:
        :return: text
        """
        pass

    @abstractmethod
    def create_media_urls(self, **kwargs):
        """
        media_urlのリストを作成し、return
        :param kwargs:
        :return: media_urls (ex: ['otapick.com/media/blog_images/...', 'otapick.com/media/blog_images/...', ...])
        """
        pass

    def create_media_ids(self, **kwargs):
        media_ids = []
        for file_name in self.create_media_urls(**kwargs):
            res = self.api.media_upload(file_name)
            media_ids.append(res.media_id)
        return media_ids

    def tweet(self, **kwargs):
        text = self.create_text(**kwargs)
        media_ids = self.create_media_ids(**kwargs)

        try:
            self.api.update_status(status=text, media_ids=media_ids)
        except Exception as e:
            print(e)

    def shorten_text(self, txt, max_length):
        if len(txt) > max_length:
            txt = txt[:max_length]
            txt += '…'
        return txt

    def generate_link(self, title, link):
        text = ''
        arrow_double_down = emoji.emojize(':arrow_double_down:', use_aliases=True)
        text += '{}{}{}\n'.format(arrow_double_down, title, arrow_double_down)
        text += link
        text += '\n'
        return text

    def generate_medal_emoji(self, rank):
        if rank == 1:
            return emoji.emojize(':1st_place_medal:', use_aliases=True)
        elif rank == 2:
            return emoji.emojize(':2nd_place_medal:', use_aliases=True)
        elif rank == 3:
            return emoji.emojize(':3rd_place_medal:', use_aliases=True)

    def set_group_id(self, group_id):
        self.group_id = group_id
        if group_id == 1:
            self.group_emoji = emoji.emojize(':deciduous_tree:', use_aliases=True)
        elif group_id == 2:
            self.group_emoji = emoji.emojize(':sun_with_face:', use_aliases=True)