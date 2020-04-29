from django.shortcuts import get_object_or_404
from rest_framework import status, views
from rest_framework.response import Response

from api.serializers import MemberSerializer
from main.models import Member


class MemberRetrieveAPIView(views.APIView):
    def get(self, request, group_id, ct, *args, **kwargs):
        member = get_object_or_404(Member, belonging_group__group_id=group_id, ct=ct)
        serializer = MemberSerializer(instance=member)
        return Response(serializer.data, status.HTTP_200_OK)

memberRetrieveAPIView = MemberRetrieveAPIView.as_view()
