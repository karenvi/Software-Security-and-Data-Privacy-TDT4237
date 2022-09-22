from rest_framework import serializers
from .models import HelpRequest
import pickle
import base64


class HelpRequestSerializer(serializers.ModelSerializer):
    refugee = serializers.SlugRelatedField(
        read_only=True, slug_field='username')
    volunteer = serializers.SlugRelatedField(
        read_only=True, slug_field='username')

    request_id = serializers.SerializerMethodField()

    class Meta:
        model = HelpRequest
        fields = ('id', 'service_type', 'description',
                  'refugee', 'volunteer', 'request_id', 'finished')
        read_only_fields = ('id', 'refugee', 'volunteer',
                            'request_id', 'finished')

    def get_request_id(self, obj):
        return base64.b64encode(pickle.dumps(obj.id))
