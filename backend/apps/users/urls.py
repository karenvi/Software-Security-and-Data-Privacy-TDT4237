from django.urls import path, include
from apps.users import views

from rest_framework.routers import DefaultRouter


router = DefaultRouter()

router.register('api/users', views.UserViewSet, basename='users')
router.register('api/register', views.RegistrationViewSet, basename='register')
router.register('api/login', views.LoginViewSet, basename='login')
router.register('api/refresh', views.RefreshViewSet, basename='refresh')

urlpatterns = [*router.urls,
               path("api/verify-email/<uid>",
                    views.VerificationView.as_view(), name="verify-email"),
               path('api/reset-password/<uidb64>/<token>/',
                    views.ResetPasswordView.as_view(), name='password-reset'),
               path('api/request-reset-password/',
                    views.PasswordResetEmailView.as_view(), name='password-reset-email'),
               path('api/reset-password-validate/',
                    views.SetNewPasswordView.as_view(), name='password-reset-valid'),
               ]
