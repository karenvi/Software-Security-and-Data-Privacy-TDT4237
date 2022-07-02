from django.urls import path, include
from apps.users import views

from rest_framework.routers import DefaultRouter


router = DefaultRouter()

router.register('api/users', views.UserViewSet, basename='users')
router.register('api/register', views.RegistrationViewSet, basename='register')
router.register('api/login', views.LoginViewSet, basename='login')
router.register('api/refresh', views.RefreshViewSet, basename='refresh')

urlpatterns = [*router.urls,

               ]
