import os
import shutil
from django.core.management.base import BaseCommand
from image.models import Image
import otapick
from main.models import Blog, Member


class Command(BaseCommand):
    help = 'blogをメンテナンス。↓メンテナンス内容' \
           '1.　仮メンバー（欅坂46新二期生等）が独立した時、ブログの著者（新三期生=>山口陽世）を更新。役目を終えた仮メンバーを安全に削除。'

    # 独立した仮メンバーのCT↓
    independent_temporary_cts = [(1, 1002), (2, 1000)]

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        # 1
        blogDetailCrawler = otapick.BlogDetailCrawler()
        for temporary_member_info in self.independent_temporary_cts:
            if Member.objects.filter(belonging_group__group_id=temporary_member_info[0], ct=temporary_member_info[1]):
                temporary_member = Member.objects.get(belonging_group__group_id=temporary_member_info[0], ct=temporary_member_info[1])
                for blog in Blog.objects.filter(writer=temporary_member):
                    blog_info = blogDetailCrawler.crawl(group_id=temporary_member.belonging_group.group_id, blog_ct=blog.blog_ct)
                    if blog_info is not None:
                        blog.writer = blog_info['member']
                        blog.save()
                        otapick.print_console('「{}」 changed writer {}'.format(blog.title, blog_info['member']))
                    else:
                        otapick.print_console('blog crawl failed...')
                else:
                    if not Blog.objects.filter(writer=temporary_member).exists():
                        otapick.print_console('success writer({}) migration work!!'.format(temporary_member.full_kanji))
                        otapick.print_console('delete {}!!'.format(temporary_member.full_kanji))
                        temporary_member.delete()
