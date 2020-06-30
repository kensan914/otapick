from image.models import Image
from otapick.db import blog
from main.models import Group, Blog, Member


class ListInfo:
    def __init__(self, group_id, ct, order_format):
        self.group_id = group_id
        self.ct = ct
        self.order_format = order_format
        self.title = ''
        self.num_of_hit = 0


class BlogListInfo(ListInfo):
    def __init__(self, group_id, ct, order_format, narrowing_keyword, narrowing_post):
        super().__init__(group_id, ct, order_format)
        self.narrowing_keyword = narrowing_keyword
        self.narrowing_post = narrowing_post

    def get_result(self):
        if self.ct is None:
            if Group.objects.filter(group_id=self.group_id).exists():
                self.title = Group.objects.get(group_id=self.group_id).name
            else:
                return {'status': 'not_found_group'}
            narrowing_blogs = Blog.objects.filter(writer__belonging_group__group_id=self.group_id)
        else:
            if Member.objects.filter(belonging_group__group_id=self.group_id, ct=self.ct).exists():
                self.title = Member.objects.get(belonging_group__group_id=self.group_id, ct=self.ct).full_kanji
            else:
                return {'status': 'not_found_member'}
            narrowing_blogs = Blog.objects.filter(writer__belonging_group__group_id=self.group_id, writer__ct=self.ct)
        narrowing_blogs = blog.narrowdown_blogs_keyword(narrowing_blogs, self.narrowing_keyword)
        narrowing_blogs = blog.narrowdown_blogs_post(narrowing_blogs, self.narrowing_post)
        self.num_of_hit = narrowing_blogs.count()
        return {'title': self.title, 'num_of_hit': self.num_of_hit}


class ImageListInfo(ListInfo):
    def get_result(self):
        if self.ct is None:
            if Group.objects.filter(group_id=self.group_id).exists():
                self.title = Group.objects.get(group_id=self.group_id).name
            else:
                return {'status': 'not_found_group'}
            images = Image.objects.filter(publisher__writer__belonging_group__group_id=self.group_id)
        else:
            if Member.objects.filter(belonging_group__group_id=self.group_id, ct=self.ct).exists():
                self.title = Member.objects.get(belonging_group__group_id=self.group_id, ct=self.ct).full_kanji
            else:
                return {'status': 'not_found_member'}
            images = Image.objects.filter(publisher__writer__belonging_group__group_id=self.group_id, publisher__writer__ct=self.ct)
        self.num_of_hit = images.count()
        return {'title': self.title, 'num_of_hit': self.num_of_hit}
