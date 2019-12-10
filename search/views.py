from top.views import BaseView
from search.scripts.idToNameConverter import idToNameConverter


class SearchByBlogsView(BaseView):
    html_path = 'search/otapick_searchByBlogs.html'


searchByBlogs = SearchByBlogsView.as_view()


class SearchByMembersView(BaseView):
    html_path = 'search/otapick_searchByMembers.html'

    def get(self, request, *args, **kwargs):
        group = request.GET.get('group')
        ct = request.GET.get('ct')
        self.context = {
            'group': group,
            'ct': ct,
            'name': idToNameConverter(ct, group)
        }
        return super().get(request, *args, **kwargs)


searchByMembers = SearchByMembersView.as_view()
