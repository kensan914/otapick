from django.shortcuts import render
from django.views import View
from django.views.generic import TemplateView


class TopView(View):
    def get(self, request, *args, **kwargs):
        context = {
        }
        return render(request, 'top/otapick_top.html', context)


class SupportView(TemplateView):
    template_name = 'top/otapick_support.html'


top = TopView.as_view()
support = SupportView.as_view()
