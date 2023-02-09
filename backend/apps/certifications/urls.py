from rest_framework.routers import DefaultRouter
from django.urls import path
from apps.certifications import views

# Create a router and register our viewsets with it.
router = DefaultRouter()

router.register('api/certifications',
                views.CertificationRequestViewSet, basename='certifications')

urlpatterns = [
    path('api/certifications/answer/', views.AnswerCertificationRequest.as_view(),
         name='answer-certification-request'),
    path('api/certifications/status/',
         views.GetCertificationStatus.as_view(), name='get-certification-status'),
    * router.urls,  # Add the router urls to urlpatterns
]
