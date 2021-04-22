from rest_framework import fields, serializers
from survey.models import ProPlanSurvey, ProPlanSurveyQ1


class ProPlanSurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProPlanSurvey
        fields = ('respondent', 'q1',)

    def validate_q1(self, q1_key):
        if not q1_key in ProPlanSurveyQ1.values or q1_key == ProPlanSurveyQ1.NO_INPUT:
            raise serializers.ValidationError('The q1 key is invalid.')

        return q1_key
