from django.db import models
from django.contrib.auth import get_user_model
from apps.certifications.models import Competence
# Create your models here.


class HelpRequest(models.Model):
    service_type = models.CharField(max_length=20, choices=Competence.choices)

    description = models.TextField()

    refugee = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name='refugee_help_request')
    volunteer = models.ForeignKey(
        get_user_model(), on_delete=models.DO_NOTHING, related_name='volunteer_help_request', null=True, blank=True)

    finished = models.BooleanField(default=False)

    def __str__(self):
        return self.title
