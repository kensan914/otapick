from main.models import Group, Blog, Member


class BlogListInfo:
    def __init__(self, group_id, ct, order_format):
        self.group_id = group_id
        self.ct = ct
        self.order_format = order_format
        self.title = ''
        self.num_of_hit = 0

    def get_result(self):
        if self.ct is None:
            self.title = Group.objects.get(group_id=self.group_id).name
            self.num_of_hit = Blog.objects.filter(writer__belonging_group__group_id=self.group_id).count()
        else:
            self.title = Member.objects.get(belonging_group__group_id=self.group_id, ct=self.ct).full_kanji
            self.num_of_hit = Blog.objects.filter(writer__ct=self.ct).count()
        return {'title': self.title, 'num_of_hit': self.num_of_hit}