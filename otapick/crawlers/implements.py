from time import sleep
from otapick.crawlers.abstracts import Code, Crawler
from otapick.crawlers.generics import ImageCrawler, ImagesCrawler, BlogCrawler
from . import parsers


class MemberImageCrawler(ImageCrawler):
    """MemberImageCrawlerクラス
    公式サイトからメンバー画像のURLを取得する具象クラス。インタフェースとなるのは、crawl()メソッド。

    [crawl]
    ex) image_url = otapick.MemberImageCrawler().crawl(member.belonging_group.key, member.ct)
    Args:
        group_key (str): メンバーの所属groupのkey
        ct (str): メンバーのct
    Returns:
        str: 指定したメンバーの個人アー写のURL(success)
        None: (failed)
    """
    keyaki_url = ['https://www.keyakizaka46.com/s/k46o/artist/',
                  Code.CT, '?ima=0000']
    hinata_url = [
        'https://www.hinatazaka46.com/s/official/artist/', Code.CT, '?ima=0000']
    sakura_url = ['https://sakurazaka46.com/s/s46/artist/',
                  Code.CT, '?ima=0000']
    ### Edit ###

    def get_tag(self, soup, **kwargs):
        return parsers.get_member_image_tag(kwargs['group_key'], soup)

    def crawl(self, group_key, ct):
        return super().crawl(group_key=group_key, ct=ct)


class MemberImageCrawlerEx(ImageCrawler):
    """MemberImageCrawlerExクラス
    外部サイトからメンバー画像のURLを取得する具象クラス（主に卒業メンバー用）。インタフェースとなるのは、crawl()メソッド。

    [crawl]
    ex) image_url = otapick.MemberImageCrawlerEx().crawl(member.full_kanji)
    Args:
        member_name (str): メンバーのフルネーム
    Returns:
        str: 指定したメンバーの個人アー写のURL(success)
        None: (failed)
    """
    other_url = ['https://48pedia.org/',  Code.MEMBER_NAME]

    def get_tag(self, soup, **kwargs):
        return parsers.get_member_image_tag_ex(soup)

    def crawl(self, member_name):
        return super().crawl(member_name=member_name, image_base_url='https://48pedia.org/')


class BlogImageCrawler(ImagesCrawler):
    """BlogImageCrawlerクラス
    ブログに含まれる画像のURLを取得するための具象クラス。インタフェースとなるのは、crawl()メソッド。

    [crawl]
    ex) image_urls = otapick.BlogImageCrawler().crawl(group.key, blog_ct)
    Args:
        group_key (str): ブログのgroupのkey
        blog_ct (int): ブログのct
    Returns:
        list: 指定したブログに含まれる画像のURLリスト(success)
        None: (failed)
    """
    keyaki_url = ['https://www.keyakizaka46.com/s/k46o/diary/detail/',
                  Code.BLOG_CT, '?ima=0000&cd=member']
    hinata_url = ['https://www.hinatazaka46.com/s/official/diary/detail/',
                  Code.BLOG_CT, '?ima=0000&cd=member']
    sakura_url = ['https://sakurazaka46.com/s/s46/diary/detail/',
                  Code.BLOG_CT, '?ima=0000&cd=blog']
    ### Edit ###

    def get_tag(self, soup, **kwargs):
        return parsers.get_blog_image_tags(kwargs['group_key'], soup)

    def crawl(self, group_key, blog_ct):
        return super().crawl(group_key=group_key, blog_ct=blog_ct)


class BlogListCrawler(BlogCrawler):
    """BlogListCrawlerクラス
    各グループ公式ブログのブログ一覧からブログ情報を取得するための具象クラス。インタフェースとなるのは、crawl()メソッド。

    [crawl]
    ex) blogs_data = otapick.BlogListCrawler().crawl(group.key, page)
    Args:
        group_key (str): グループkey
        page (int): ブログ一覧のページ(0から始まる)
    Returns:
        list: 指定したページに含まれるブログの情報リスト
        [{
            'blog_ct': 34457,
            'title': '夏だ〜！',
            'post_date': (date_time),
            'member': (Memberモデルオブジェクト),
            'image_urls: ['https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202006/mob9Uad5L.jpg', ...],
        }, ...]
        None: (failed)
    """
    keyaki_url = [
        'https://www.keyakizaka46.com/s/k46o/diary/member/list?ima=0000&page=', Code.PAGE]
    hinata_url = [
        'https://www.hinatazaka46.com/s/official/diary/member/list?ima=0000&page=', Code.PAGE]
    sakura_url = [
        'https://sakurazaka46.com/s/s46/diary/blog/list?ima=0000&page=', Code.PAGE]
    ### Edit ###

    # ブログ一覧ページでblog_ctを取得できないため、モバイルのブログ一覧でブログ情報を取得する
    access_as_mobile_group_keys = ['sakura', ]
    ### Edit ###

    # ブログ一覧ページでは情報が不足しているため、ブログごとに詳細ページにとび情報を取得する
    haveto_access_detail_group_keys = ['sakura', ]
    ### Edit ###

    def get_tag(self, soup, **kwargs):
        return parsers.get_blog_tags(kwargs['group_key'], soup)

    def crawl(self, group_key, page):
        if group_key in self.access_as_mobile_group_keys:
            as_mobile = True
        else:
            as_mobile = False
        blog_tags = super().crawl(group_key=group_key, page=page, as_mobile=as_mobile)
        if blog_tags is None:
            return

        blogs_data = []
        blog_detail_crawler = BlogDetailCrawler()
        for blog_tag in blog_tags:
            if group_key in self.haveto_access_detail_group_keys:
                blog_info = self.parse_blog_by_detail(
                    group_key, blog_tag, blog_detail_crawler)
                sleep(0.5)
            else:
                blog_info = self.parse_blog(
                    group_key, blog_tag, image_base_url=self.image_base_url)
            if blog_info is None:
                return
            else:
                blogs_data.append(blog_info)
        return blogs_data


class BlogDetailCrawler(BlogCrawler):
    """BlogDetailCrawlerクラス
    各グループ公式ブログのブログ詳細からブログ情報を取得するための具象クラス。インタフェースとなるのは、crawl()メソッド。

    [crawl]
    ex) blog_info = otapick.BlogDetailCrawler().crawl(group.key, blog.blog_ct)
    Args:
        group_key (str): グループkey
        blog_ct (int): ブログCT
    Returns:
        dict: 指定したページに含まれるブログの情報(BlogListCrawlerと同一フォーマット)
        None: (failed)
    """
    keyaki_url = ['https://www.keyakizaka46.com/s/k46o/diary/detail/',
                  Code.BLOG_CT, '?ima=0000&cd=member']
    hinata_url = ['https://www.hinatazaka46.com/s/official/diary/detail/',
                  Code.BLOG_CT, '?ima=0000&cd=member']
    sakura_url = ['https://sakurazaka46.com/s/s46/diary/detail/',
                  Code.BLOG_CT, '?ima=0000&cd=blog']
    ### Edit ###

    def get_tag(self, soup, **kwargs):
        return parsers.get_blog_tag(kwargs['group_key'], soup)

    def crawl(self, group_key, blog_ct):
        blog_tag = super().crawl(group_key=group_key, blog_ct=blog_ct)

        if not blog_tag:
            return 404

        blog_info = self.parse_blog(
            group_key, blog_tag, blog_ct=blog_ct, image_base_url=self.image_base_url)
        if blog_info is None:
            return
        else:
            return blog_info


class TextCrawler(Crawler):
    """BlogCrawlerクラス
    各グループ公式ブログのブログ詳細から本文DOMを取得するための具象クラス。インタフェースとなるのは、crawl()メソッド。

    [crawl]
    ex) text = otapick.TextCrawler().crawl(group.key, blog_ct)
    Args:
        group_key (int): グループkey
        blog_ct (int): ブログCT
    Returns:
        str: 本文DOM
        None: (failed)
    """
    keyaki_url = ['https://www.keyakizaka46.com/s/k46o/diary/detail/',
                  Code.BLOG_CT, '?ima=0000&cd=member']
    hinata_url = ['https://www.hinatazaka46.com/s/official/diary/detail/',
                  Code.BLOG_CT, '?ima=0000&cd=member']
    sakura_url = ['https://sakurazaka46.com/s/s46/diary/detail/',
                  Code.BLOG_CT, '?ima=0000&cd=blog']
    ### Edit ###

    def get_tag(self, soup, **kwargs):
        return parsers.get_article_tag(kwargs['group_key'], soup)

    def crawl(self, group_key, blog_ct):
        tag = super().crawl(group_key=group_key, blog_ct=blog_ct)
        if tag is None:
            return
        return str(tag)
