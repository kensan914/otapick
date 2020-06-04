from otapick.crawlers.abstracts import Code
from otapick.crawlers.generics import ImageCrawler


class MemberImageCrawler(ImageCrawler):
    keyaki_url = ['https://www.keyakizaka46.com/s/k46o/artist/', Code.CT, '?ima=0000']
    hinata_url = ['https://www.hinatazaka46.com/s/official/artist/', Code.CT, '?ima=0000']

    def get_tag(self, soup, **kwargs):
        if kwargs['group_id'] == 1:
            image_tag = soup.find('div', class_='box-profile_img')
        elif kwargs['group_id'] == 2:
            image_tag = soup.find('div', class_='c-member__thumb')
        else:
            return
        image_tag = image_tag.find('img')
        return image_tag

    def crawl(self, group_id, ct):
        return super().crawl(group_id=group_id, ct=ct)


class MemberImageCrawlerEx(ImageCrawler):
    other_url = ['https://48pedia.org/',  Code.MEMBER_NAME]

    def get_tag(self, soup, **kwargs):
        image_tag = soup.find('td', class_='infobox-image-wrapper')
        image_tag = image_tag.find('img')
        return image_tag

    def crawl(self, member_name):
        return super().crawl(member_name=member_name, base_url='https://48pedia.org/')
