from django.db.models import Q
from top.views import BaseView
from django.views import generic
from .models import Member, Blog
from .scripts.css_classConverter import css_classConverter


class SearchByLatestView(generic.ListView, BaseView):
    template_name = html_path = 'search/otapick_searchByBlogs.html'
    model = Blog
    paginate_by = 10

    def get(self, request, *args, **kwargs):
        if self.request.GET.get('q'):
            return BaseView.get(self, self.request)
        else:
            return generic.ListView.get(self, self.request)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        group_id = self.kwargs.get('group_id')
        searchByLatestCtx = {
            'isLatest': True,
            'group_id': group_id,
            'hit': True,
            'group': css_classConverter(group_id),
        }
        context.update(searchByLatestCtx)
        return context

    def get_queryset(self):
        group_id = self.kwargs.get('group_id')
        members = Member.objects.filter(belonging_group__group_id=group_id)
        return Blog.objects.filter(writer__in=members).order_by('-post_date')


searchByLatest = SearchByLatestView.as_view()


class SearchByBlogsView(generic.ListView, BaseView):
    template_name = html_path = 'search/otapick_searchByBlogs.html'
    model = Blog
    paginate_by = 20

    def get(self, request, *args, **kwargs):
        if self.request.GET.get('q'):
            return BaseView.get(self, self.request)
        else:
            return generic.ListView.get(self, self.request)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        group_id = self.kwargs.get('group_id')
        searchByBlogsCtx = {
            'isLatest': False,
            'group_id': group_id,
            'hit': True,
            'group': css_classConverter(group_id),
        }
        context.update(searchByBlogsCtx)
        return context

    def get_queryset(self):
        group_id = self.kwargs.get('group_id')
        members = Member.objects.filter(belonging_group__group_id=group_id)
        return Blog.objects.filter(writer__in=members).order_by('-post_date')


searchByBlogs = SearchByBlogsView.as_view()


class SearchByMembersView(generic.ListView, BaseView):
    template_name = html_path = 'search/otapick_searchByMembers.html'
    model = Blog
    paginate_by = 20

    def get(self, request, *args, **kwargs):
        if self.request.GET.get('q'):
            return BaseView.get(self, self.request)
        else:
            return generic.ListView.get(self, self.request)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        group_id = self.kwargs.get('group_id')
        ct = self.kwargs.get('ct')
        member = Member.objects.get(ct=ct, belonging_group__group_id=int(group_id))
        order_format = self.request.GET.get('sort')
        searchByMembersCtx = {
            'group_id': group_id,
            'ct': ct,
            'member': member,
            'group': css_classConverter(group_id),
            'order_format': order_format
        }
        context.update(searchByMembersCtx)
        return context

    def get_queryset(self):
        group_id = self.kwargs.get('group_id')
        ct = self.kwargs.get('ct')
        member = Member.objects.get(ct=ct, belonging_group__group_id=int(group_id))
        if self.request.GET.get('sort'):
            order_format = self.request.GET.get('sort')
            if order_format == 'older_post':
                return Blog.objects.filter(writer=member).order_by('post_date')
        return Blog.objects.filter(writer=member).order_by('-post_date')


searchByMembers = SearchByMembersView.as_view()


class SearchMemberView(generic.ListView, BaseView):
    html_path = template_name = 'search/otapick_searchMember.html'
    model = Member
    paginate_by = 20

    def get(self, request, *args, **kwargs):
        if self.request.GET.get('q'):
            return BaseView.get(self, self.request)
        else:
            return generic.ListView.get(self, self.request)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        searchText = self.kwargs.get('searchText')
        searchMemberCtx = {
            'searchText': searchText,
            'group': 'keyaki',
        }
        context.update(searchMemberCtx)
        return context

    def get_queryset(self):
        searchText = self.kwargs.get('searchText')
        match_members = Member.objects.filter(Q(full_kanji__icontains=searchText) | Q(full_kana__icontains=searchText))
        return match_members.order_by('belonging_group__group_id', 'full_kana')


searchMember = SearchMemberView.as_view()


class SearchUnjustURLView(BaseView):
    html_path = 'search/otapick_searchByBlogs.html'

    def get(self, request, *args, **kwargs):
        self.context['hit'] = False
        return super().get(self.request)


searchUnjustURL = SearchUnjustURLView.as_view()
