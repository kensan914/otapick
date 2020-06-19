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
    other_url = []


    def get_url(self, **kwargs):
        url_structure = []
        if not self.other_url:
            if kwargs['group_id'] == 1:
                url_structure = self.keyaki_url
            elif kwargs['group_id'] == 2:
                url_structure = self.hinata_url
        else:
            url_structure = self.other_url
        url_structure = [url_part if type(url_part) is str else str(kwargs[str(url_part)]) for url_part in url_structure]
        return urljoin(*url_structure)

    def get(self, **kwargs):
        try:
            url = self.get_url(**kwargs)
            urllib3.disable_warnings(InsecureRequestWarning)
            http = urllib3.PoolManager(
                cert_reqs='CERT_REQUIRED',
                ca_certs=certifi.where())
            return http.request('GET', url)
        except: return

    def parse(self, response):
        return BeautifulSoup(response.data, 'lxml')

    @abstractmethod
    def get_tag(self, soup, **kwargs):
        pass

    @abstractmethod
    def crawl(self, **kwargs):
        response = self.get(**kwargs)
        soup = self.parse(response)
        tag = self.get_tag(soup, **kwargs)
        return tag


class Code(Enum):
    GROUP_ID = 'group_id'
    CT = 'ct'
    MEMBER_NAME = 'member_name'
    BLOG_CT = 'blog_ct'

    def __str__(self):
        return self.value
