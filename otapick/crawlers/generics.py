from abc import ABC, abstractmethod
from urllib.parse import urljoin
from otapick.crawlers.abstracts import Crawler


class TextCrawler(Crawler):
    def get_tag(self, soup, **kwargs):
        if kwargs['group_id'] == 1:
            article_tag = soup.find('div', class_='box-article')
        elif kwargs['group_id'] == 2:
            article_tag = soup.find('div', class_='c-blog-article__text')
        else:
            return
        return article_tag

    def crawl(self, **kwargs):
        tag = super().crawl()
        return str(tag)


class ImageCrawler(Crawler, ABC):
    @abstractmethod
    def crawl(self, **kwargs):
        img_tag = super().crawl(**kwargs)
        img_url = img_tag.get('src')
        # urlにホストが省略されている場合
        if 'base_url' in kwargs:
            img_url = urljoin(kwargs['base_url'], img_url)
        return img_url


class ImagesCrawler(Crawler, ABC):
    @abstractmethod
    def crawl(self, **kwargs):
        url_list = []
        img_tags = super().crawl(**kwargs)
        if img_tags is None:
            return
        for img_tag in img_tags:
            img_url = img_tag.get('src')
            url_list.append(img_url)
        return url_list
