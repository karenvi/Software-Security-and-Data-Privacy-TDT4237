import datetime
from django.core.management.utils import get_random_secret_key
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from django.core.mail import EmailMessage
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.conf import settings
from .models import User, Document
from rest_framework.exceptions import AuthenticationFailed
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator
import hashlib

SECRET_KEY1 = get_random_secret_key()
SECRET_KEY2 = get_random_secret_key()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for users"""

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email', 'is_volunteer', 'is_staff']
        read_only_fields = ['id']


class LoginSerializer(TokenObtainPairSerializer):
    """Serializer for login"""

    def validate(self, attrs):
        data = super().validate(attrs)

        # use get_token() from TokenObtainPairSerializer to get refresh token and access token
        refresh = self.get_token(self.user)

        # add user data to response
        data['user'] = UserSerializer(self.user).data
        # add refresh token to response
        data['refresh'] = str(refresh)
        # add access token to response
        data['access'] = str(refresh.access_token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data  # return response

# function that generates a token hashed to sha256, to make email urls more secure
def generate_token():
        sha256 = hashlib.sha256()

        # Uses two secret keys to make it hard for hackers... although sha256 is not the safest
        #option out there, nobody actually knows the next secreet key
        sha256.update(SECRET_KEY1.encode('utf-8') + SECRET_KEY2.encode('utf-8'))
        return sha256.hexdigest()

class RegisterSerializer(UserSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(
        max_length=128, min_length=1, write_only=True, required=True)
    email = serializers.CharField(
        max_length=128, min_length=1,  required=True)

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email', 'password', 'is_volunteer']
    

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)

        user.is_active = False  # set user to inactive until email is verified
        user.save()

        # create email to send to user
        email = validated_data["email"]
        email_subject = "Activate your account"
        uid = urlsafe_base64_encode(user.username.encode())
        token = generate_token()
        domain = get_current_site(self.context["request"])
        current_time = datetime.datetime.now()
        link = reverse('verify-email', kwargs={"uid": uid, "token": token, "timestamp": current_time.timestamp()})

        url = f"{settings.PROTOCOL}://{domain}{link}"

        mail = EmailMessage(
            email_subject,
            url,
            None,
            [email],
        )
        mail.send(fail_silently=False)  # send email to user

        return user

    def validate(self, data):

        # get the password from the data
        password = data.get('password')

        errors = dict()
        try:
            # validate the password and catch the exception
            validate_password(password=password)

        # the exception raised here is different than serializers.ValidationError
        except exceptions.ValidationError as e:
            errors['password'] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return super(RegisterSerializer, self).validate(data)


class ResetPasswordSerializer(serializers.ModelSerializer):
    """Serializer for password reset"""

    class Meta:
        model = get_user_model()
        fields = ['email', "username"]


class SetNewPasswordSerializer(serializers.Serializer):
    """Serializer for setting new password"""

    password = serializers.CharField(
        style={"input_type": "password"}, write_only=True)
    password1 = serializers.CharField(
        style={"input_type": "password"}, write_only=True)
    token = serializers.CharField(
        min_length=1, write_only=True)
    uid = serializers.CharField(
        min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'password1', 'token', 'uid']

    def validate(self, attrs):
        password = attrs.get('password')
        password1 = attrs.get('password1')
        token = attrs.get('token')
        uid = attrs.get('uid')

        id = force_str(urlsafe_base64_decode(uid))
        user = get_user_model().objects.get(id=id)
        errorMessage = dict()

        try:
            # validate password using django's validate_password
            validate_password(password)
        except exceptions.ValidationError as error:
            errorMessage['message'] = list(error.messages)

        if errorMessage:  # if there is an error, raise it
            raise serializers.ValidationError(errorMessage)

        if password != password1:  # check if passwords match
            raise serializers.ValidationError("Passwords must match!")

        user.set_password(password)  # set new password
        user.save()

        return user


class DocumentPostSerializer(serializers.ModelSerializer):
    """
    Serializer for the upload Documents.
    """
    class Meta:
        model = Document
        fields = ('id', 'document')


class DocumentGetSerializer(serializers.ModelSerializer):
    """
    Serializer for the download of Documents.
    """
    link = serializers.SerializerMethodField()  # link to download the document
    name = serializers.SerializerMethodField()  # name of the document

    class Meta:
        model = Document
        fields = ('id', 'user', 'link', 'name')

    def get_link(self, obj):  # get the link to download the document
        domain = get_current_site(self.context["request"])
        link = reverse('document-download', kwargs={"pk": obj.id})

        link = f"{settings.PROTOCOL}://{domain}{link}"
        return link

    def get_name(self, obj):
        # name is stored as documents/id/filename, so splitting and selecting last item gets only the filename.
        return obj.document.name.split('/')[-1]
