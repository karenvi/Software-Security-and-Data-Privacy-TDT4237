from django.db import models
from django.contrib.auth import get_user_model
from apps.certifications.models import Competence
# Create your models here.


class HelpRequest(models.Model):
    """Model for help requests"""
    service_type = models.CharField(
        max_length=20, choices=Competence.choices)  # Type of service requested. Use Competence enum as choices.

    description = models.TextField()  # Description of the request

    refugee = models.ForeignKey(  # User who created the request
        get_user_model(), on_delete=models.CASCADE, related_name='refugee_help_request')
    volunteer = models.ForeignKey(  # User who accepted the request
        get_user_model(), on_delete=models.DO_NOTHING, related_name='volunteer_help_request', null=True, blank=True)

    finished = models.BooleanField(default=False)  # If the request is finished
