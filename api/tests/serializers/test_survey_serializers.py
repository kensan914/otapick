from api.models.survey.factories import ProPlanSurveyFactory
from api.serializers.survey_serializers import ProPlanSurveySerializer
from api.tests.serializers.helpers.SerializerTestCase import SerializerTestCase


class TestProPlanSurveySerializer(SerializerTestCase):
    def test_output_data(self):
        pro_plan_survey_factory = ProPlanSurveyFactory.create()
        serializer_data = ProPlanSurveySerializer(pro_plan_survey_factory).data

        expected_output_data = {
            "respondent": pro_plan_survey_factory.respondent.id,
            "q1": pro_plan_survey_factory.q1,
        }

        self.assertSerializerData(serializer_data, expected_output_data)
