import user_agents


def check_is_mobile(request):
    return user_agents.parse(request.META['HTTP_USER_AGENT']).is_mobile or user_agents.parse(request.META['HTTP_USER_AGENT']).is_tablet