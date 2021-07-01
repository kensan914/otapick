import uuid
import factory
from django.utils import timezone
from factory.django import DjangoModelFactory
from factory.fuzzy import FuzzyChoice
from api.models.account.factories import AccountFactory
from api.models.survey.models import ProPlanSurvey, ProPlanSurveyQ1


class ProPlanSurveyFactory(DjangoModelFactory):
    class Meta:
        model = ProPlanSurvey

    id = factory.LazyFunction(uuid.uuid4)
    respondent = factory.SubFactory(AccountFactory)
    q1 = FuzzyChoice(ProPlanSurveyQ1, getter=lambda c: c[0])
    created_at = factory.LazyFunction(timezone.now)
