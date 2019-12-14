from django.shortcuts import render
from search.scripts.searchTextClassifier import searchTextClassifier
from top.views import BaseView
from django.views import generic
from .models import Member, Blog


class SearchByLatestView(BaseView, generic.ListView):
    template_name = html_path = 'search/otapick_searchByBlogs.html'
    model = Blog
    paginate_by = 20

    def get_context_data(self, **kwargs):
        if self.request.GET.get('q'):
            super().get(self.request)
        context = super().get_context_data(**kwargs)
        group_id = self.kwargs.get('group_id')
        searchByLatestCtx = {
            'isLatest': True,
            'group_id': group_id,
        }
        context.update(searchByLatestCtx)
        return context


searchByLatest = SearchByLatestView.as_view()


class SearchByBlogsView(BaseView, generic.ListView):
    template_name = html_path = 'search/otapick_searchByBlogs.html'
    model = Blog
    paginate_by = 20

    def get_context_data(self, **kwargs):
        if self.request.GET.get('q'):
            super().get(self.request)
        context = super().get_context_data(**kwargs)
        # page = self.request.GET.get('page')
        group_id = self.kwargs.get('group_id')
        searchByBlogsCtx = {
            'isLatest': False,
            # 'page': page,
            'group_id': group_id,
        }
        context.update(searchByBlogsCtx)
        return context


searchByBlogs = SearchByBlogsView.as_view()


class SearchByMembersView(generic.ListView, BaseView):
    template_name = html_path = 'search/otapick_searchByMembers.html'
    model = Blog
    paginate_by = 20

    def get_context_data(self, **kwargs):
        if self.request.GET.get('q'):
            super(generic.ListView).get(self.request)
        context = super().get_context_data(**kwargs)
        group_id = self.kwargs.get('group_id')
        ct = self.kwargs.get('ct')
        member = Member.objects.get(ct=ct, belonging_group__group_id=int(group_id))
        searchByMembersCtx = {
            'group_id': group_id,
            'ct': ct,
            'member': member,
        }
        context.update(searchByMembersCtx)
        return context

    def get_queryset(self):
        group_id = self.kwargs.get('group_id')
        ct = self.kwargs.get('ct')
        return Blog.objects.filter(writer=Member.objects.get(ct=ct, belonging_group__group_id=int(group_id)))


searchByMembers = SearchByMembersView.as_view()


class SearchMemberView(BaseView, generic.ListView):
    html_path = template_name = 'search/otapick_searchMember.html'
    model = Member
    paginate_by = 20


searchMember = SearchMemberView.as_view()