from rest_framework import serializers
from .models import CertificationRequest


class CertificationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificationRequest
        fields = ['id', 'user', 'competence', 'status', 'created']
        read_only_fields = ['id', 'user', 'created']
