from django.shortcuts import render
from django.views import View
from search.scripts.searchTextClassifier import searchTextClassifier


class BaseView(View):
    html_path = 'top/otapick_top.html'
    context = {}

    def get(self, request, *args, **kwargs):
        inputText = request.GET.get('q')
        if inputText:
            result = searchTextClassifier(inputText)
            if result['input'] == 'url':
                if result['class'] == 'detail':
                    return render(request, 'imgSaver/otapick_save.html', result)
                elif result['class'] == 'searchByBlogs':
                    return render(request, 'search/otapick_searchByBlogs.html', result)
                elif result['class'] == 'searchByMembers':
                    return render(request, 'search/otapick_searchByMembers.html', result)
            return render(request, self.html_path, result)
        return render(request, self.html_path, self.context)


class TopView(BaseView):
    html_path = 'top/otapick_top.html'


top = TopView.as_view()


class SupportView(BaseView):
    html_path = 'top/otapick_support.html'


support = SupportView.as_view()
