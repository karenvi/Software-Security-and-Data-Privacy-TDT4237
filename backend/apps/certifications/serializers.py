from rest_framework import serializers
from .models import CertificationRequest


class CertificationRequestSerializer(serializers.ModelSerializer):

    user = serializers.SlugRelatedField(
        read_only=True, slug_field='username')

    class Meta:
        model = CertificationRequest
        fields = ['id', 'user', 'competence', 'status', 'created']
        read_only_fields = ['id', 'user', 'created']
