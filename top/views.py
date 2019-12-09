from django.shortcuts import render
from django.views import View
from blogSearch.scripts.searchTextClassifier import searchTextClassifier


class TopView(View):
    def get(self, request, *args, **kwargs):
        inputText = request.GET.get('q')
        context = {}
        if inputText:
            result = searchTextClassifier(inputText)
            if result['input'] == 'url':
                if result['class'] == 'detail':
                    return render(request, 'imgSaver/otapick_save.html', result)
                elif result['class'] == 'searchByBlogs':
                    return render(request, 'blogSearch/otapick_result2.html', result)
                elif result['class'] == 'searchByMembers':
                    return render(request, 'blogSearch/otapick_result.html', result)
            return render(request, 'top/otapick_top.html', result)
        return render(request, 'top/otapick_top.html', context)


top = TopView.as_view()


class SupportView(View):
    def get(self, request, *args, **kwargs):
        inputText = request.GET.get('q')
        context = {}
        if inputText:
            result = searchTextClassifier(inputText)
            if result['input'] == 'url':
                if result['class'] == 'detail':
                    return render(request, 'imgSaver/otapick_save.html', result)
                elif result['class'] == 'searchByBlogs':
                    return render(request, 'blogSearch/otapick_result2.html', result)
                elif result['class'] == 'searchByMembers':
                    return render(request, 'blogSearch/otapick_result.html', result)
            return render(request, 'top/otapick_support.html', result)
        return render(request, 'top/otapick_support.html', context)


support = SupportView.as_view()
