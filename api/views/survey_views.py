from rest_framework import views, permissions, status
from rest_framework.response import Response

from api.serializers.survey_serializers import ProPlanSurveySerializer


class ProPlanSurveyAPIView(views.APIView):
    """
    post data: { q1: "buy", }
    """

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        post_data = {"respondent": request.user.id, **request.data}
        pro_plan_survey_serializer = ProPlanSurveySerializer(data=post_data)
        if pro_plan_survey_serializer.is_valid():
            pro_plan_survey_serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(
                data=pro_plan_survey_serializer.errors, status=status.HTTP_404_NOT_FOUND
            )


proPlanSurveyAPIView = ProPlanSurveyAPIView.as_view()
