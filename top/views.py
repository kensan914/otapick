from django.shortcuts import render, redirect
from django.views import View
from config import settings
from search.scripts.firstClassifier import firstClassifier
from search.models import Blog
from search.scripts.searchViewSubFunc import check_is_mobile


class BaseView(View):
    html_path = 'top/top.html'
    context = {'static_update': '?20200415', 'debug': settings.env.bool('DEBUG')}

    def get(self, request, *args, **kwargs):
        input_text = request.GET.get('q')
        if input_text:
            result = firstClassifier(input_text)
            if result['input'] == 'url':
                if result['class'] == 'detail':
                    return redirect('download:download', group_id=result['group_id'], blog_ct=result['blog_ct'])
                elif result['class'] == 'searchByLatest':
                    return redirect('search:searchByLatest', group_id=result['group_id'])
                elif result['class'] == 'searchByBlogs':
                    response = redirect('search:searchByBlogs', group_id=result['group_id'], page=result['page'])
                    if result['dy']:
                        response['location'] += '?dy=' + result['dy']
                    return response
                elif result['class'] == 'searchByMembers':
                    response = redirect('search:searchByMembersURL', group_id=result['group_id'], ct=result['ct'], page=result['page'])
                    if result['dy']:
                        response['location'] += '?dy=' + result['dy']
                    return response
                else:
                    return redirect('search:searchUnjustURL')
            elif result['input'] == 'name':
                if result['class'] == 'appropriate':
                    return redirect('search:searchMember', searchText=result['searchText'])
                else:
                    return redirect('search:searchUnjustMember')
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
