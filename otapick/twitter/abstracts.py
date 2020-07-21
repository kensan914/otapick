from abc import ABCMeta, abstractmethod
import tweepy
from otapick.lib.constants import TWITTER_CK, TWITTER_CS, TWITTER_AT, TWITTER_AS


class TwitterBot(metaclass=ABCMeta):
    def __init__(self):
        auth = tweepy.OAuthHandler(TWITTER_CK, TWITTER_CS)
        auth.set_access_token(TWITTER_AT, TWITTER_AS)
        self.api = tweepy.API(auth)

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