from urllib.parse import quote_plus
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import render
from config import settings
from main.scripts.firstClassifier import firstClassifier
from main.scripts.searchViewSubFunc import check_is_mobile
from main.forms import NarrowingForm
from django.views import View
from main.scripts.searchViewFunc import *


class BaseView(View):
    html_path = 'top/top.html'
    context = {'static_update': '?20200417_2', 'debug': settings.env.bool('DEBUG')}

    def get(self, request, *args, **kwargs):
        input_text = request.GET.get('q')
        if input_text:
            result = firstClassifier(input_text)
            if result['input'] == 'url':
                if result['class'] == 'detail':
                    return redirect('image:image', group_id=result['group_id'], blog_ct=result['blog_ct'])
                elif result['class'] == 'searchByLatest':
                    return redirect('main:searchByLatest', group_id=result['group_id'])
                elif result['class'] == 'searchByBlogs':
                    response = redirect('main:searchByBlogs', group_id=result['group_id'], page=result['page'])
                    if result['dy']:
                        response['location'] += '?dy=' + result['dy']
                    return response
                elif result['class'] == 'searchByMembers':
                    response = redirect('main:searchByMembersURL', group_id=result['group_id'], ct=result['ct'], page=result['page'])
                    if result['dy']:
                        response['location'] += '?dy=' + result['dy']
                    return response
                else:
                    return redirect('main:searchUnjustURL')
            elif result['input'] == 'name':
                if result['class'] == 'appropriate':
                    return redirect('main:searchMember', searchText=result['searchText'])
                else:
                    return redirect('main:searchUnjustMember')
        else:
            self.context['isMobile'] = check_is_mobile(self.request)
            self.context['group'] = request.session.get('group', 'keyaki')
            self.context['keyaki_newblogs']\
                = Blog.objects.filter(writer__belonging_group__group_id=1).order_by('-post_date', 'order_for_simul')[:8]
            self.context['hinata_newblogs'] \
                = Blog.objects.filter(writer__belonging_group__group_id=2).order_by('-post_date', 'order_for_simul')[:8]
            self.context['keyaki_popularblogs'] \
                = Blog.objects.filter(writer__belonging_group__group_id=1).order_by('-score', '-num_of_most_downloads', '-post_date', 'order_for_simul')[:8]
            self.context['hinata_popularblogs'] \
                = Blog.objects.filter(writer__belonging_group__group_id=2).order_by('-score', '-num_of_most_downloads', '-post_date', 'order_for_simul')[:8]
            return render(request, self.html_path, self.context)


class TopView(BaseView):
    html_path = 'top/top.html'


top = TopView.as_view()


class SupportView(BaseView):
    html_path = 'top/support.html'


support = SupportView.as_view()


class SearchByLatestView(generic.ListView, BaseView):
    template_name = html_path = 'main/searchByBlogs.html'
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
        group = convert_css_class(group_id)
        self.request.session['group'] = group
        searchByLatest_ctx = BaseView.context
        searchByLatest_ctx.update({
            'isLatest': True,
            'group_id': group_id,
            'hit': True,
            'group': group,
            'isMobile': check_is_mobile(self.request),
            'is_member': False,
        })
        context.update(searchByLatest_ctx)
        return context

    def get_queryset(self):
        group_id = self.kwargs.get('group_id')
        members = Member.objects.filter(belonging_group__group_id=group_id, graduate=False)
        if group_id == 1:
            return Blog.objects.filter(writer__in=members).order_by('-post_date', 'order_for_simul')[:10]
        elif group_id == 2:
            return Blog.objects.filter(writer__in=members).order_by('-post_date', 'order_for_simul')[:12]


searchByLatest = SearchByLatestView.as_view()


class SearchByURLView(generic.ListView, BaseView):
    template_name = html_path = 'main/searchByBlogs.html'
    model = Blog
    paginate_by = 20
    is_member = True

    def get(self, request, *args, **kwargs):
        if self.request.GET.get('q'):
            return BaseView.get(self, self.request)
        else:
            return generic.ListView.get(self, self.request)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        group_id = self.kwargs.get('group_id')
        group = convert_css_class(group_id)
        self.request.session['group'] = group
        searchByBlogs_ctx = BaseView.context
        searchByBlogs_ctx.update({
            'isLatest': False,
            'group_id': group_id,
            'group': group,
            'hit': True,
            'isMobile': check_is_mobile(self.request),
            'is_member': self.is_member
        })
        ct = self.kwargs.get('ct')
        if ct:
            # print("ct", ct)
            searchByBlogs_ctx['ct'] = ct
            if Member.objects.filter(belonging_group__group_id=group_id, ct=ct).exists():
                searchByBlogs_ctx['member'] = Member.objects.get(belonging_group__group_id=group_id, ct=ct)
        context.update(searchByBlogs_ctx)
        return context

    def get_queryset(self):
        group_id = self.kwargs.get('group_id')
        ct = self.kwargs.get('ct')
        if ct:
            members = Member.objects.filter(belonging_group__group_id=group_id, ct=ct)
        else:
            members = Member.objects.filter(belonging_group__group_id=group_id, graduate=False)

        dy_text = self.request.GET.get('dy')
        if dy_text:
            dy = get_dy(dy_text)
            if dy['year'] and dy['month']:
                dy_blogs = Blog.objects.filter(writer__in=members, post_date__year=dy['year'], post_date__month=dy['month'])
                if dy['day']:
                    return dy_blogs.filter(post_date__day=dy['day']).order_by('-post_date', 'order_for_simul')
                else:
                    return dy_blogs.order_by('-post_date', 'order_for_simul')
        return Blog.objects.filter(writer__in=members).order_by('-post_date', 'order_for_simul')


class SearchByBlogsView(SearchByURLView):
    is_member = False


searchByBlogs = SearchByBlogsView.as_view()


class SearchByMemersURLView(SearchByURLView):
    is_member = True


searchByMembersURL = SearchByMemersURLView.as_view()


class BlogListView(generic.ListView, BaseView):
    template_name = html_path = 'main/blogList.html'
    model = Blog
    paginate_by = 20
    is_member = True

    def get(self, request, *args, **kwargs):
        if self.request.GET.get('page'):
            if not request.is_ajax():
                url = request.get_full_path()
                url_removed_page = remove_query(url, 'page')
                return redirect(url_removed_page)

        if self.request.GET.get('q'):
            return BaseView.get(self, self.request)
        else:
            return generic.ListView.get(self, self.request)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        group_id, ct, member, order_format, narrowing_post, narrowing_keyword, page = blogList_init(self, self.is_member)
        group = convert_css_class(group_id)
        self.request.session['group'] = group
        listOfBlogs_ctx = BaseView.context
        listOfBlogs_ctx.update({
            'group_id': group_id,
            'ct': ct,
            'member': member,
            'group': group,
            'order_format': order_format,
            'narrowing_post': narrowing_post,
            'narrowing_keyword': narrowing_keyword,
            'kw_placeholder': kw_placeholder(group_id),
            'form': NarrowingForm(self.request.POST),
            'isMobile': check_is_mobile(self.request),
            'page': page,
        })
        context.update(listOfBlogs_ctx)
        return context

    def get_queryset(self):
        group_id, ct, member, order_format, narrowing_post, narrowing_keyword, page = blogList_init(self, self.is_member)
        if self.is_member:
            narrowing_blogs = Blog.objects.filter(writer=member)
        else:
            narrowing_blogs = Blog.objects.filter(writer__belonging_group__group_id=group_id)
        if narrowing_post:
            narrowing_blogs = narrowing_blogs.filter(post_date__year=narrowing_post['year'],
                                                     post_date__month=narrowing_post['month'])
            if 'day' in narrowing_post:
                narrowing_blogs = narrowing_blogs.filter(post_date__day=narrowing_post['day'])
        if narrowing_keyword:
            narrowing_blogs = narrowing_blogs.filter(title__icontains=narrowing_keyword)
        if order_format:
            if order_format == 'older_post':
                return narrowing_blogs.order_by('post_date', '-order_for_simul')
            elif order_format == 'popularity':
                return narrowing_blogs.order_by('-score', '-num_of_most_downloads', '-post_date', 'order_for_simul')
            elif order_format == 'dl':
                return narrowing_blogs.order_by('-num_of_most_downloads', '-score', '-post_date', 'order_for_simul')
            elif order_format == 'sum_dl':
                return narrowing_blogs.order_by('-num_of_downloads', '-score', '-post_date', 'order_for_simul')
            elif order_format == 'view':
                return narrowing_blogs.order_by('-num_of_views', '-score', '-post_date', 'order_for_simul')
        return narrowing_blogs.order_by('-post_date', 'order_for_simul')

    def post(self, request, *args, **kwargs):
        group_id = self.kwargs.get('group_id')

        if self.is_member:
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

        if self.is_member:
            response = redirect('main:searchByMembers', group_id=group_id, ct=ct)
        else:
            response = redirect('main:searchByGroups', group_id=group_id)
        if order_format != 'None':
            response['location'] += '?sort=' + order_format
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


class SearchByMembersView(BlogListView):
    is_member = True


searchByMembers = SearchByMembersView.as_view()


class SearchByGroupsView(BlogListView):
    is_member = False


searchByGroups = SearchByGroupsView.as_view()


class SearchMemberView(generic.ListView, BaseView):
    html_path = template_name = 'main/searchMember.html'
    model = Member
    paginate_by = 100

    def get(self, request, *args, **kwargs):
        return get_q_member(self, isListView=True, BaseView=BaseView)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        searchText = self.kwargs.get('searchText')
        searchMember_ctx = BaseView.context
        searchMember_ctx.update({
            'searchText': searchText,
            'group': self.request.session.get('group', 'keyaki'),
            'appropriate': True,
        })
        context.update(searchMember_ctx)
        return context

    def get_queryset(self):
        searchText = self.kwargs.get('searchText')
        match_members = Member.objects.filter(Q(full_kanji__contains=searchText) | Q(full_kana__contains=searchText) |
                                              Q(full_eng__icontains=searchText))
        return match_members.order_by('belonging_group__group_id', 'full_kana')


searchMember = SearchMemberView.as_view()


class SearchUnjustURLView(BaseView):
    html_path = 'main/searchByBlogs.html'

    def get(self, request, *args, **kwargs):
        self.context['hit'] = False
        return super().get(self.request)


searchUnjustURL = SearchUnjustURLView.as_view()


class MemberListView(generic.ListView, BaseView):
    html_path = template_name = 'main/memberList.html'
    model = Member
    paginate_by = 50
    keyaki_exist = True
    hinata_exist = True

    def get(self, request, *args, **kwargs):
        return get_q_member(self, isListView=True, BaseView=BaseView)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        initial_letter = self.request.GET.get('initial')
        forced_group = self.request.GET.get('group')
        selected_group = self.request.GET.get('s_group')
        searchMember_ctx = BaseView.context
        searchMember_ctx.update({
            'group': self.request.session.get('group', 'keyaki'),
            'initial': convert_eng(initial_letter),
            'forced_group': forced_group,
            'selected_group': selected_group,
            'keyaki_exist': self.keyaki_exist,
            'hinata_exist': self.hinata_exist,
        })
        context.update(searchMember_ctx)
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
        return get_q_member(self, isListView=False, BaseView=BaseView)


searchUnjustMember = SearchUnjustMemberView.as_view()


class AutocompleteView(View):
    def get(self, request, *args, **kwargs):
        input_text = self.request.GET.get('input')
        members_data = []
        if input_text:
            match_members = Member.objects.filter(
                Q(full_kana__iregex=r'^%s' % input_text) | Q(first_kana__iregex=r'^%s' % input_text) |
                Q(full_kanji__iregex=r'^%s' % input_text) | Q(first_kanji__iregex=r'^%s' % input_text) |
                Q(full_eng__iregex=r'^%s' % input_text) | Q(first_eng__iregex=r'^%s' % input_text)
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


class ReactView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'frontend/index.html', BaseView.context)


react = ReactView.as_view()