"""crawlersパッケージ
グループが追加、または改名など変更があった際の修正Tips
1. 変更するファイルはabstracts.py, implements.py, parsers.pyの3つ
2. グループ情報に依存していて変更・追記すべき箇所は「### Edit ###」で表すので、そのワードで検索する
"""
from urllib.parse import urljoin
from abc import abstractmethod, ABCMeta
from enum import Enum
import certifi
import urllib3
from bs4 import BeautifulSoup
from urllib3.exceptions import InsecureRequestWarning


class Crawler(metaclass=ABCMeta):
    keyaki_url = []
    hinata_url = []
    sakura_url = []
    ### Edit ###

    other_url = []
    image_base_url = ""

    def set_image_base_url(self, **kwargs):
        if kwargs["group_key"] == "keyaki":
            self.image_base_url = "https://cdn.keyakizaka46.com/"
        elif kwargs["group_key"] == "hinata":
            self.image_base_url = "https://cdn.hinatazaka46.com/images/"
        elif kwargs["group_key"] == "sakura":
            self.image_base_url = "https://sakurazaka46.com/"
        ### Edit ###

    def get_url(self, **kwargs):
        if not self.other_url:
            if kwargs["group_key"] == "keyaki":
                url_structure = self.keyaki_url
            elif kwargs["group_key"] == "hinata":
                url_structure = self.hinata_url
            elif kwargs["group_key"] == "sakura":
                url_structure = self.sakura_url
            ### Edit ###
            else:
                return
        else:
            url_structure = self.other_url
        url_structure = [
            url_part if type(url_part) is str else str(kwargs[str(url_part)])
            for url_part in url_structure
        ]
        url = ""
        for url_part in url_structure:
            if url.endswith("="):  # query parameter
                url += url_part
            else:
                url = urljoin(url, url_part)
        return url

    def get(self, **kwargs):
        try:
            url = self.get_url(**kwargs)
            if url is None:
                return
            urllib3.disable_warnings(InsecureRequestWarning)
            http = urllib3.PoolManager(
                cert_reqs="CERT_REQUIRED", ca_certs=certifi.where()
            )
            if "as_mobile" in kwargs and kwargs["as_mobile"]:
                headers = {
                    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) > > AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
                }
            else:
                headers = {}
            return http.request("GET", url, headers=headers)
        except:
            return

    def parse(self, response):
        return BeautifulSoup(response.data, "lxml")

    @abstractmethod
    def get_tag(self, soup, **kwargs):
        pass

    @abstractmethod
    def crawl(self, **kwargs):
        self.set_image_base_url(**kwargs)
        response = self.get(**kwargs)
        if response is None:
            return
        soup = self.parse(response)
        tag = self.get_tag(soup, **kwargs)
        return tag


class Code(Enum):
    CT = "ct"
    MEMBER_NAME = "member_name"
    BLOG_CT = "blog_ct"
    PAGE = "page"

    def __str__(self):
        return self.value
