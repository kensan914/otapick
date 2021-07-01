from django.db import models
import uuid


class ProPlanSurveyQ1(models.TextChoices):
    BUY = "buy", "絶対買う"
    MIGHT_BUY = "mightBuy", "買うかもしれない"
    DONT_BUY = "dontBuy", "絶対買わない"
    NO_INPUT = "noInput", "未回答"


class ProPlanSurvey(models.Model):
    class Meta:
        verbose_name = verbose_name_plural = "pro planアンケート"
        ordering = ("-created_at",)

    def __str__(self):
        return "{}".format(self.respondent.name)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    respondent = models.ForeignKey(
        "custom_account.Account", verbose_name="回答者", on_delete=models.CASCADE
    )
    q1 = models.CharField(
        verbose_name="1. もし300円/月のpro planがあったら？",
        max_length=100,
        choices=ProPlanSurveyQ1.choices,
        default=ProPlanSurveyQ1.NO_INPUT,
    )
    created_at = models.DateTimeField(verbose_name="回答日", auto_now_add=True)
