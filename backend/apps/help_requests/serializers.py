from rest_framework import serializers
from .models import HelpRequest
import pickle
import base64


class HelpRequestSerializer(serializers.ModelSerializer):
    """ Serializer for help requests"""
    refugee = serializers.SlugRelatedField(
        read_only=True, slug_field='username')
    volunteer = serializers.SlugRelatedField(
        read_only=True, slug_field='username')

    # This field will be used to identify the request. get_request_id() is used to encode the request id for this field
    request_id = serializers.SerializerMethodField()

    class Meta:
        model = HelpRequest
        fields = ('id', 'service_type', 'description',
                  'refugee', 'volunteer', 'request_id', 'finished')
        read_only_fields = ('id', 'refugee', 'volunteer',
                            'request_id', 'finished')

    def get_request_id(self, obj):  # This method will be used to encode the request id
        return base64.b64encode(pickle.dumps(obj.id))
