from django.contrib.auth import get_user_model
from rest_framework import permissions, viewsets, filters, status, generics, views
from apps.users.serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.response import Response
from django.shortcuts import redirect
from django.contrib.sites.shortcuts import get_current_site
from django.conf import settings
from django.core.mail import EmailMessage
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from .models import Document
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponse, HttpResponseNotFound
from django.core.exceptions import PermissionDenied
from apps.help_requests.models import HelpRequest
from .permissions import DocumentPermission


class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        if self.request.user.is_superuser:  # Admin users can see info of every user
            return get_user_model().objects.all()
        else:
            # Normal users only see information about themselves
            return get_user_model().objects.filter(pk=self.request.user.id)


class RegistrationViewSet(viewsets.ModelViewSet, TokenObtainPairView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        res = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        return Response({
            "user": serializer.data,
            "refresh": res["refresh"],
            "token": res["access"]
        }, status=status.HTTP_201_CREATED)


class LoginViewSet(viewsets.ModelViewSet, TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class RefreshViewSet(viewsets.ViewSet, TokenRefreshView):
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class VerificationView(generics.GenericAPIView):
    def get(self, request, uid):
        verified_url = settings.URL + "/verified"
        invalid_url = settings.URL + "/invalid"
        try:
            username = urlsafe_base64_decode(uid).decode()
            user = get_user_model().objects.filter(username=username).first()
            user.is_active = True
            user.save()

            return redirect(verified_url)

        except Exception as ex:
            pass

        return redirect(invalid_url)


class PasswordResetEmailView(generics.GenericAPIView):
    serializer_class = ResetPasswordSerializer

    def post(self, request):
        if request.data.get("email") and request.data.get("username"):
            email = request.data["email"]
            username = request.data["username"]

            if get_user_model().objects.filter(email=email, username=username).exists():
                user = get_user_model().objects.get(email=email, username=username)

                uid = urlsafe_base64_encode(force_bytes(user.pk))
                domain = get_current_site(request).domain
                token = PasswordResetTokenGenerator().make_token(user)
                link = reverse(
                    'password-reset', kwargs={"uidb64": uid, "token": token})

                url = f"{settings.PROTOCOL}://{domain}{link}"
                email_subject = "Password reset"
                mail = EmailMessage(
                    email_subject,
                    url,
                    None,
                    [email],
                )
                mail.send(fail_silently=False)
        return Response({'success': "If the user exists, you will shortly receive a link to reset your password."}, status=status.HTTP_200_OK)


class ResetPasswordView(generics.GenericAPIView):
    def get(self, request, uidb64, token):

        new_password_url = settings.URL + "/new_password"
        invalid_url = settings.URL + "/invalid"
        try:
            id = force_str(urlsafe_base64_decode(uidb64))
            user = get_user_model().objects.get(pk=id)

            if not PasswordResetTokenGenerator().check_token(user, token):  # Verify that the token is valid for the user
                return redirect(invalid_url)

            return redirect(f'{new_password_url}?uid={uidb64}&token={token}')

        except Exception as ex:
            pass

        return redirect(invalid_url)


class SetNewPasswordView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)


class DocumentViewSet(viewsets.ModelViewSet):

    queryset = Document.objects.all()

    permission_classes = [DocumentPermission]
    parser_classes = [MultiPartParser, FormParser]

    http_method_names = ['get', 'head', 'post', 'delete']

    def get_serializer_class(self):
        if self.action == 'create':
            return DocumentPostSerializer

        return DocumentGetSerializer

    def perform_create(self, serializer):
        serializer.save(
            content_type=self.request.data.get('document').content_type, user=self.request.user)

    def get_queryset(self):
        return Document.objects.filter(user=self.request.user)


class GetDocumentsForRefugeeView(generics.GenericAPIView):
    serializer_class = DocumentGetSerializer

    def get(self, request, refugee_username):

        user = request.user
        refugee = get_user_model().objects.filter(username=refugee_username).first()
        if refugee:
            requests = HelpRequest.objects.filter(volunteer=user)
            if requests.filter(refugee=refugee).exists():
                documents = Document.objects.filter(user=refugee)
                serializer = self.serializer_class(
                    documents, many=True, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_403_FORBIDDEN)


class DocumentDownloadView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            document = Document.objects.get(pk=pk)
        except:
            return HttpResponseNotFound('<h1>File not found :(</h1>')
        user = request.user
        owner = document.user
        requests = HelpRequest.objects.filter(volunteer=user)
        refugees = map(lambda x: x.refugee, requests)
        if user == owner or owner in refugees or user.is_staff:
            response = HttpResponse(
                document.document, content_type=document.content_type)
            return response
        else:
            raise PermissionDenied(
                {"Message": "You do not have permission to access this file."})
