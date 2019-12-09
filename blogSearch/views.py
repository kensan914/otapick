from django.shortcuts import render
from django.views import View
from blogSearch.scripts.searchTextClassifier import searchTextClassifier
from blogSearch.scripts.idToNameConverter import idToNameConverter


class ResultByBlogsView(View):
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
            return render(request, 'blogSearch/otapick_result2.html', result)
        return render(request, 'blogSearch/otapick_result2.html', context)


byBlogs = ResultByBlogsView.as_view()


class ResultByMembersView(View):
    def get(self, request, *args, **kwargs):
        inputText = request.GET.get('q')
        group = request.GET.get('group')
        ct = request.GET.get('ct')
        context = {
            'group': group,
            'ct': ct,
            'name': idToNameConverter(ct, group)
        }
        if inputText:
            result = searchTextClassifier(inputText)
            if result['input'] == 'url':
                if result['class'] == 'detail':
                    return render(request, 'imgSaver/otapick_save.html', result)
                elif result['class'] == 'searchByBlogs':
                    return render(request, 'blogSearch/otapick_result2.html', result)
                elif result['class'] == 'searchByMembers':
                    return render(request, 'blogSearch/otapick_result.html', result)
            return render(request, 'blogSearch/otapick_result.html', result)
        return render(request, 'blogSearch/otapick_result.html', context)


byMembers = ResultByMembersView.as_view()
