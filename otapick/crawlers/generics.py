from abc import ABC, abstractmethod
from urllib.parse import urljoin
import otapick
from main.models import Member
from otapick.crawlers.abstracts import Crawler
from . import parsers


class ImageCrawler(Crawler, ABC):
    @abstractmethod
    def crawl(self, **kwargs):
        img_tag = super().crawl(**kwargs)
        if img_tag is None: return
        img_url = img_tag.get('src')
        if img_url == '' or img_url is None:
            return
        # urlにホストが省略されている場合
        if 'base_url' in kwargs:
            img_url = urljoin(kwargs['base_url'], img_url)
        return img_url


class ImagesCrawler(Crawler, ABC):
    @abstractmethod
    def crawl(self, **kwargs):
        img_tags = super().crawl(**kwargs)
        if img_tags is None:
            return
        return parsers.get_url_list(img_tags)


class BlogCrawler(Crawler, ABC):
    def get_tag(self, soup, **kwargs):
        return parsers.get_blog_tags(kwargs['group_id'], soup)

    def parse_blog(self, group_id, blog_tag, blog_ct=None):
        blog_info = {}

        ### get blog_ct ###
        if blog_ct is None:
            blog_url = parsers.get_blog_url(group_id, blog_tag)
            if blog_url is None: return
            blog_ct = otapick.extractBlog_ct(blog_url)
        blog_info['blog_ct'] = blog_ct

        ### get title ###
        title_tag = parsers.get_blog_title_tag(group_id, blog_tag)
        if title_tag is None: return
        title = otapick.clean_text(title_tag.text)
        blog_info['title'] = title

        ### get post_date ###
        postdate_tag = parsers.get_blog_postdate_tag(group_id, blog_tag)
        if postdate_tag is None: return
        post_date = otapick.convert_datetime(postdate_tag.text, group_id=group_id)
        blog_info['post_date'] = post_date

        ### get member ###
        writer_name = parsers.get_blog_writer_name(group_id, blog_tag)
        if writer_name is None: return
        writer_name = otapick.clean_text(writer_name)
        member = Member.objects.get(belonging_group__group_id=group_id, full_kanji=writer_name)
        blog_info['member'] = member

        ### get image_url ###
        img_tags = parsers.get_blog_image_tags(group_id, blog_tag)
        if img_tags is None:
            return
        else:
            image_urls = parsers.get_url_list(img_tags)
            blog_info['image_urls'] = image_urls
        return blog_info

    @abstractmethod
    def crawl(self, **kwargs):
        return super().crawl(**kwargs)
