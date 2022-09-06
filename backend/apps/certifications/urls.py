from rest_framework.routers import DefaultRouter
from django.urls import path
from apps.certifications import views


router = DefaultRouter()

router.register('api/certifications',
                views.CertificationRequestViewSet, basename='certifications')


urlpatterns = [*router.urls,
               path('api/certifications/answer', views.AnswerCertificationRequest.as_view(),
                    name='answer-certification-request'),
               ]
