from rest_framework.routers import DefaultRouter
from django.urls import path
from apps.help_requests import views


router = DefaultRouter()

router.register('api/help_requests', views.HelpRequestViewSet,
                basename='help_requests')


urlpatterns = [
    path('api/help_requests/accept/', views.AcceptHelpRequest.as_view(),
         name='accept-help_request'),
    path('api/help_requests/finish/', views.FinishHelpRequest.as_view(),
         name='finish-help_request'),
    * router.urls,
]
