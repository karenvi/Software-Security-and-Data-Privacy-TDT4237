from rest_framework import serializers
from .models import CertificationRequest


class CertificationRequestSerializer(serializers.ModelSerializer):

    """Serializer for certification requests"""

    user = serializers.SlugRelatedField(  # create a slug field for the user field. This will be used to display the username instead of the user id
        read_only=True, slug_field='username')

    class Meta:
        model = CertificationRequest
        fields = ['id', 'user', 'competence', 'status', 'created']
        read_only_fields = ['id', 'user', 'created']
