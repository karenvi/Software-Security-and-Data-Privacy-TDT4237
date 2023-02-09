from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.


class Competence(models.TextChoices):
    """Enum for competence """
    MEDICAL = 'MEDICAL'
    TRANSPORT = 'TRANSPORT'
    FOOD = 'FOOD'
    SHELTER = 'SHELTER'


class Status(models.TextChoices):
    """Enum for certification request status """
    ACCEPTED = 'A'
    DECLINED = 'D'
    PENDING = 'P'


class CertificationRequest(models.Model):
    """Model for certification requests"""
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    competence = models.CharField(max_length=20, choices=Competence.choices)
    status = models.CharField(
        max_length=1, choices=Status.choices, default=Status.PENDING)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created']
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'competence'], name='unique_certification')
        ]

    @staticmethod
    def IsCertified(user, competence):
        """Check if user is certified for a competence"""
        return CertificationRequest.objects.filter(user=user, status=Status.ACCEPTED, competence=competence).exists()
