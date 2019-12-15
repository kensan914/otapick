from django.shortcuts import render, redirect
from django.views import View
from search.scripts.firstClassifier import firstClassifier


class BaseView(View):
    html_path = 'top/otapick_top.html'
    context = {}

    def get(self, request, *args, **kwargs):
        inputText = request.GET.get('q')
        if inputText:
            result = firstClassifier(inputText)
            if result['input'] == 'url':
                if result['class'] == 'detail':
                    return redirect('download:download', group_id=result['group_id'], blog_ct=result['blog_ct'])
                elif result['class'] == 'searchByLatest':
                    return redirect('search:searchByLatest', group_id=result['group_id'])
                elif result['class'] == 'searchByBlogs':
                    return redirect('search:searchByBlogs', group_id=result['group_id'], page=result['page'])
                    # response = redirect('search:searchByBlogs', group_id=result['group_id'])
                    # response['location'] += '?page=' + str(result['page'])
                    # return response
                elif result['class'] == 'searchByMembers':
                    response = redirect('search:searchByMembers', group_id=result['group_id'], ct=result['ct'])
                    response['location'] += '?page=' + str(result['page'])
                    return response
                else:
                    return redirect('search:searchUnjustURL')
            elif result['input'] == 'name':
                return redirect('search:searchMember', searchText=result['searchText'])
        return render(request, self.html_path, self.context)


class TopView(BaseView):
    html_path = 'top/otapick_top.html'


top = TopView.as_view()


class SupportView(BaseView):
    html_path = 'top/otapick_support.html'


support = SupportView.as_view()
