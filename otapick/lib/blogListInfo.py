from otapick.db import blogORMapper
from main.models import Group, Blog, Member


class BlogListInfo:
    def __init__(self, group_id, ct, order_format, narrowing_keyword, narrowing_post):
        self.group_id = group_id
        self.ct = ct
        self.order_format = order_format
        self.narrowing_keyword = narrowing_keyword
        self.narrowing_post = narrowing_post
        self.title = ''
        self.num_of_hit = 0

    def get_result(self):
        if self.ct is None:
            self.title = Group.objects.get(group_id=self.group_id).name
            narrowing_blogs = Blog.objects.filter(writer__belonging_group__group_id=self.group_id)
        else:
            self.title = Member.objects.get(belonging_group__group_id=self.group_id, ct=self.ct).full_kanji
            narrowing_blogs = Blog.objects.filter(writer__belonging_group__group_id=self.group_id, writer__ct=self.ct)
        narrowing_blogs = blogORMapper.narrowdown_blogs_keyword(narrowing_blogs, self.narrowing_keyword)
        narrowing_blogs = blogORMapper.narrowdown_blogs_post(narrowing_blogs, self.narrowing_post)
        self.num_of_hit = narrowing_blogs.count()
        return {'title': self.title, 'num_of_hit': self.num_of_hit}