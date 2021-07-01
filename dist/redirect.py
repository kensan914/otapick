from django.http import HttpResponse
from django.views import View


### Redirect past URL to new URL ###
class RedirectView(View):
    location = ""

    def get(self, request, *args, **kwargs):
        self.setLocation()
        response = HttpResponse(status=301)
        response["Location"] = self.location
        return response

    def setLocation(self):
        pass


class RedirectBlogsGView(RedirectView):
    def setLocation(self):
        group_id = self.kwargs.get("group_id")
        self.location = "/blogs/{}/".format(group_id)


class RedirectBlogsMView(RedirectView):
    def setLocation(self):
        group_id = self.kwargs.get("group_id")
        ct = self.kwargs.get("ct")
        self.location = "/blogs/{}/{}/".format(group_id, ct)


class RedirectImageView(RedirectView):
    def setLocation(self):
        group_id = self.kwargs.get("group_id")
        blog_ct = self.kwargs.get("blog_ct")
        order = self.kwargs.get("order")
        self.location = "/image/{}/{}/{}/".format(group_id, blog_ct, order)


class RedirectMembersView(RedirectView):
    def setLocation(self):
        self.location = "/members/"


redirectBlogsGView = RedirectBlogsGView.as_view()
redirectBlogsMView = RedirectBlogsMView.as_view()
redirectImageView = RedirectImageView.as_view()
redirectMembersView = RedirectMembersView.as_view()
