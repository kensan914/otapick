from django.contrib import admin
from survey.models import ProPlanSurvey


@admin.register(ProPlanSurvey)
class ProPlanSurveyAdmin(admin.ModelAdmin):
    list_display = ("respondent", "q1", "created_at")
    list_display_links = ("respondent",)
    raw_id_fields = ("respondent",)
