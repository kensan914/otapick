from urllib.parse import quote_plus
import user_agents
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import redirect
from search.forms import NarrowingForm
from top.views import BaseView
from django.views import generic, View
from .models import Member, Blog
from .scripts.searchViewFunc import css_classConverter, searchByMembers_init, q_member_get, kw_placeholder, \
    member_initial_narrower, eng_converter, dy_getter


class SearchByLatestView(generic.ListView, BaseView):
    template_name = html_path = 'search/otapick_searchByBlogs.html'
    model = Blog
    paginate_by = 12

    def get(self, request, *args, **kwargs):
        if self.request.GET.get('q'):
            return BaseView.get(self, self.request)
        else:
            return generic.ListView.get(self, self.request)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        group_id = self.kwargs.get('group_id')
        group = css_classConverter(group_id)
        self.request.session['group'] = group
        searchByLatestCtx = {
            'isLatest': True,
            'group_id': group_id,
            'hit': True,
            'group': group,
        }
        context.update(searchByLatestCtx)
        return context

    def get_queryset(self):
        group_id = self.kwargs.get('group_id')
        members = Member.objects.filter(belonging_group__group_id=group_id)
        if group_id == 1:
            return Blog.objects.filter(writer__in=members).order_by('-post_date')[:10]
        elif group_id == 2:
            return Blog.objects.filter(writer__in=members).order_by('-post_date')[:12]


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
        group = css_classConverter(group_id)
        self.request.session['group'] = group
        searchByBlogsCtx = {
            'isLatest': False,
            'group_id': group_id,
            'hit': True,
            'group': group,
        }
        context.update(searchByBlogsCtx)
        return context

    def get_queryset(self):
        group_id = self.kwargs.get('group_id')
        members = Member.objects.filter(belonging_group__group_id=group_id)
        dy_text = self.request.GET.get('dy')
        if dy_text:
            dy = dy_getter(dy_text)
            if dy['year'] and dy['month']:
                dy_blogs = Blog.objects.filter(writer__in=members, post_date__year=dy['year'],post_date__month=dy['month'])
                if dy['day']:
                    return dy_blogs.filter(post_date__day=dy['day']).order_by('-post_date')
                else:
                    return dy_blogs.order_by('-post_date')
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
        group_id, ct, member, order_format, narrowing_post, narrowing_keyword = searchByMembers_init(self)
        group = css_classConverter(group_id)
        self.request.session['group'] = group
        searchByMembersCtx = {
            'group_id': group_id,
            'ct': ct,
            'member': member,
            'group': group,
            'order_format': order_format,
            'narrowing_post': narrowing_post,
            'narrowing_keyword': narrowing_keyword,
            'kw_placeholder': kw_placeholder(group_id),
            'form': NarrowingForm(self.request.POST),
            'isMobile': user_agents.parse(self.request.META['HTTP_USER_AGENT']).is_mobile
        }
        context.update(searchByMembersCtx)
        return context

    def get_queryset(self):
        group_id, ct, member, order_format, narrowing_post, narrowing_keyword = searchByMembers_init(self)
        narrowing_blogs = Blog.objects.filter(writer=member)
        if narrowing_post:
            narrowing_blogs = narrowing_blogs.filter(writer=member, post_date__year=narrowing_post['year'],
                                                 post_date__month=narrowing_post['month'])
            if 'day' in narrowing_post:
                narrowing_blogs = narrowing_blogs.filter(post_date__day=narrowing_post['day'])
        if narrowing_keyword:
            narrowing_blogs = narrowing_blogs.filter(title__icontains=narrowing_keyword)
        if order_format:
            if order_format == 'older_post':
                return narrowing_blogs.order_by('post_date')
        return narrowing_blogs.order_by('-post_date')

    def post(self, request, *args, **kwargs):
        group_id = self.kwargs.get('group_id')
        ct = self.kwargs.get('ct')
        form = NarrowingForm(request.POST)
        is_valid = form.is_valid()

        if is_valid:
            n_keyword = form.cleaned_data['keyword']
            n_keyword_query = quote_plus(n_keyword)
            n_post = form.cleaned_data['post']
        else:
            n_keyword = n_keyword_query = n_post = None

        order_format = self.request.GET.get('sort')

        narrowing_keyword = self.request.GET.get('keyword')
        narrowing_year = self.request.GET.get('year')
        narrowing_month = self.request.GET.get('month')
        narrowing_day = self.request.GET.get('day')
        if narrowing_keyword and not n_keyword:
            n_keyword = narrowing_keyword
            n_keyword_query = quote_plus(n_keyword)
        if narrowing_year and narrowing_month and not n_post:
           if narrowing_day:
               n_post = narrowing_year + '-' + narrowing_month + '-' + narrowing_day
           else:
               n_post = narrowing_year + '-' + narrowing_month

        response = redirect('search:searchByMembers', group_id=group_id, ct=ct)
        if order_format != 'None':
            response['location'] += '?order=' + order_format
            if n_keyword:
                response['location'] += '&keyword=' + n_keyword_query
            if n_post:
                response['location'] += '&post=' + n_post
        else:
            if n_post and n_keyword:
                response['location'] += '?keyword='+n_keyword_query + '&post='+n_post
            elif n_keyword:
                response['location'] += '?keyword=' + n_keyword_query
            elif n_post:
                response['location'] += '?post=' + n_post
        return response


searchByMembers = SearchByMembersView.as_view()


class SearchMemberView(generic.ListView, BaseView):
    html_path = template_name = 'search/otapick_searchMember.html'
    model = Member
    paginate_by = 100

    def get(self, request, *args, **kwargs):
        return q_member_get(self, isListView=True)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        searchText = self.kwargs.get('searchText')
        searchMemberCtx = {
            'searchText': searchText,
            'group': self.request.session.get('group', 'keyaki'),
            'appropriate': True,
        }
        context.update(searchMemberCtx)
        return context

    def get_queryset(self):
        searchText = self.kwargs.get('searchText')
        match_members = Member.objects.filter(Q(full_kanji__contains=searchText) | Q(full_kana__contains=searchText) |
                                              Q(full_eng__icontains=searchText))
        return match_members.order_by('belonging_group__group_id', 'full_kana')


searchMember = SearchMemberView.as_view()


class SearchUnjustURLView(BaseView):
    html_path = 'search/otapick_searchByBlogs.html'

    def get(self, request, *args, **kwargs):
        self.context['hit'] = False
        return super().get(self.request)


searchUnjustURL = SearchUnjustURLView.as_view()


class MemberListView(generic.ListView, BaseView):
    html_path = template_name = 'search/otapick_memberList.html'
    model = Member
    paginate_by = 50
    keyaki_exist = True
    hinata_exist = True

    def get(self, request, *args, **kwargs):
        return q_member_get(self, isListView=True)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        initial_letter = self.request.GET.get('initial')
        forced_group = self.request.GET.get('group')
        selected_group = self.request.GET.get('s_group')
        searchMemberCtx = {
            'group': self.request.session.get('group', 'keyaki'),
            'initial': eng_converter(initial_letter),
            'forced_group': forced_group,
            'selected_group': selected_group,
            'keyaki_exist': self.keyaki_exist,
            'hinata_exist': self.hinata_exist,
        }
        context.update(searchMemberCtx)
        return context

    def get_queryset(self, **kwargs):
        if self.request.GET.get('initial'):
            initial_letter = self.request.GET.get('initial')
            members = member_initial_narrower(initial_letter)
            self.keyaki_exist = members.filter(belonging_group__group_id=1).exists()
            self.hinata_exist = members.filter(belonging_group__group_id=2).exists()
        else:
            members = Member.objects.all()
        return members.order_by('belonging_group__group_id', 'full_kana')


memberList = MemberListView.as_view()


class SearchUnjustMemberView(BaseView):
    def get(self, request, *args, **kwargs):
        return q_member_get(self, isListView=False)


searchUnjustMember = SearchUnjustMemberView.as_view()


class AutocompleteView(View):
    def get(self, request, *args, **kwargs):
        inputText = self.request.GET.get('input')
        members_data = []
        if inputText:
            match_members = Member.objects.filter(
                Q(full_kana__iregex=r'^%s' % inputText) | Q(first_kana__iregex=r'^%s' % inputText) |
                Q(full_kanji__iregex=r'^%s' % inputText) | Q(first_kanji__iregex=r'^%s' % inputText) |
                Q(full_eng__iregex=r'^%s' % inputText)
            )
            for member in match_members:
                member_data = {
                    'name': member.full_kanji,
                    'group_id': member.belonging_group.group_id,
                    'ct': member.ct,
                }
                members_data.append(member_data)
        return JsonResponse(members_data, safe=False)


autocomplete = AutocompleteView.as_view()
