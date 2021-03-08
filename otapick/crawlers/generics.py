from abc import ABC, abstractmethod
from datetime import datetime
from urllib.parse import urljoin
from django.utils.timezone import make_aware
import otapick
from main.models import Member
from otapick.crawlers.abstracts import Crawler
from . import parsers


class ImageCrawler(Crawler, ABC):
    @abstractmethod
    def crawl(self, **kwargs):
        self.set_image_base_url(**kwargs)
        img_tag = super().crawl(**kwargs)
        if img_tag is None: return
        img_url = img_tag.get('src')
        if img_url == '' or img_url is None:
            return
        # urlにホストが省略されている場合
        if not img_url.startswith('http'):
            if 'image_base_url' in kwargs:
                img_url = urljoin(kwargs['image_base_url'], img_url)
            elif self.image_base_url:
                img_url = urljoin(self.image_base_url, img_url)
        return img_url


class ImagesCrawler(Crawler, ABC):
    @abstractmethod
    def crawl(self, **kwargs):
        self.set_image_base_url(**kwargs)
        img_tags = super().crawl(**kwargs)
        if img_tags is None:
            return
        return parsers.get_url_list(img_tags, image_base_url=self.image_base_url)


class BlogCrawler(Crawler, ABC):
    # 改名グループの対応表。keyに改名前グループkey、valueに改名後グループkey
    renamed_groups = {
        'keyaki': 'sakura'
        ### Edit ###
    }

    def parse_blog(self, group_key, blog_tag, blog_ct=None, image_base_url=None):
        blog_info = {}

        ### get blog_ct ###
        if blog_ct is None:
            blog_url = parsers.get_blog_url(group_key, blog_tag)
            if blog_url is None: return
            blog_ct = otapick.extract_blog_ct(blog_url)
        blog_info['blog_ct'] = blog_ct

        ### get title ###
        title_tag = parsers.get_blog_title_tag(group_key, blog_tag)
        if title_tag is None: return
        title = otapick.clean_text(title_tag.text)
        blog_info['title'] = title

        ### get post_date ###
        postdate_tag = parsers.get_blog_postdate_tag(group_key, blog_tag)
        if postdate_tag is None: return
        new_datetime_text = ' '.join(postdate_tag.text.split())
        # 公式のMの桁数が誤っていたため対処
        new_datetime_text_split_colon = new_datetime_text.split(':')
        if len(new_datetime_text_split_colon[-1]) > 2:
            new_datetime_text = new_datetime_text_split_colon[0] + ':' + new_datetime_text_split_colon[1][:2]

        if group_key == 'keyaki' or group_key == 'sakura':
            dt = datetime.strptime(new_datetime_text, '%Y/%m/%d %H:%M')
        elif group_key == 'hinata':
            dt = datetime.strptime(new_datetime_text, '%Y.%m.%d %H:%M')
        ### Edit ###
        else:
            dt = None
        post_date = make_aware(dt)
        blog_info['post_date'] = post_date

        ### get member ###
        writer_name = parsers.get_blog_writer_name(group_key, blog_tag)
        if writer_name is None: return
        writer_name = otapick.clean_text(writer_name)

        # 改名前グループを指定したらMemberがマッチしないため対処
        if group_key in self.renamed_groups:
            _group_key = self.renamed_groups[group_key]
        else:
            _group_key = group_key
        member = Member.objects.filter(belonging_group__key=_group_key, full_kanji=writer_name).first()
        blog_info['member'] = member

        ### get image_url ###
        img_tags = parsers.get_blog_image_tags(group_key, blog_tag)
        if img_tags is None:
            return
        else:
            image_urls = parsers.get_url_list(img_tags, image_base_url)
            blog_info['image_urls'] = image_urls
        return blog_info

    def parse_blog_by_detail(self, group_key, blog_tag, blog_detail_crawler):
        """
        blog_tagからblog_ctのみ取得し、blog_detail_crawlerに処理を投げる
        """
        ### get blog_ct ###
        blog_url = parsers.get_blog_url(group_key, blog_tag)
        if blog_url is None: return
        blog_ct = otapick.extract_blog_ct(blog_url)

        blog_info = blog_detail_crawler.crawl(group_key, blog_ct)
        return blog_info

    @abstractmethod
    def crawl(self, **kwargs):
        return super().crawl(**kwargs)
