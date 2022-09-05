from django.db import models

# Create your models here.


class Competence(models.TextChoices):  # enum for competences
    MEDICAL = 'MEDICAL'
    TRANSPORT = 'TRANSPORT'
    FOOD = 'FOOD'
    SHELTER = 'SHELTER'


class CertificationRequest(models.Model):
    """Model for certification requests"""
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    competence = models.CharField(max_length=20, choices=Competence.choices)
    status = models.CharField(max_length=20, choices=Competence.choices)
    date = models.DateField(auto_now_add=True)
    comment = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.user.username
