from api.models.account.factories import AccountFactory
from api.models.survey.factories import ProPlanSurveyFactory
from api.models.survey.models import ProPlanSurvey
from api.tests.models.helpers.ModelTestCase import ModelTestCase


class TestProPlanSurveyModel(ModelTestCase):
    def __init_Model__(self):
        return ProPlanSurvey

    def __init_Factory__(self):
        return ProPlanSurveyFactory

    def __init_test_fields__(self):
        return [
            "id",
            "respondent",
            "q1",
            "created_at",
        ]

    def test_update(self):
        created_pro_plan_survey = ProPlanSurveyFactory()

        account_factory = AccountFactory()
        pro_plan_survey_factory2 = ProPlanSurveyFactory.build(
            id=created_pro_plan_survey.id, respondent=account_factory
        )

        created_pro_plan_survey.respondent = pro_plan_survey_factory2.respondent
        created_pro_plan_survey.q1 = pro_plan_survey_factory2.q1
        created_pro_plan_survey.created_at = pro_plan_survey_factory2.created_at
        created_pro_plan_survey.save()

        update_pro_plan_survey = ProPlanSurvey.objects.first()
        self.assertModel(
            update_pro_plan_survey,
            pro_plan_survey_factory2,
        )
