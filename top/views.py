from django.shortcuts import render
from django.views import View
from django.views.generic import TemplateView
from blogSearch.forms import SearchForm
from blogSearch.scripts.classifier import searchTextClassifier


class TopView(View):
    def get(self, request, *args, **kwargs):
        form = SearchForm(request.GET)
        context = {
            'form': form
        }
        return render(request, 'top/otapick_top.html', context)

    def post(self, request, *args, **kwargs):
        form = SearchForm(request.POST)
        context = {
            'form': form
        }
        if form.is_valid():
            result = searchTextClassifier(form.cleaned_data['search_text'])
            # 分岐分岐
        else:
            return render(request, 'top/otapick_top.html', context)


top = TopView.as_view()


class SupportView(TemplateView):
    template_name = 'top/otapick_support.html'


support = SupportView.as_view()
