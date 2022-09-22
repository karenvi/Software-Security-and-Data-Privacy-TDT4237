import base64
import pickle
from django.shortcuts import render
from django.db.models import Q
from rest_framework import permissions, viewsets, generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from .serializers import HelpRequestSerializer
from .models import HelpRequest
from apps.certifications.models import Competence, CertificationRequest
from apps.certifications.permissions import IsVolunteer
# Create your views here.


class HelpRequestViewSet(viewsets.ModelViewSet):

    serializer_class = HelpRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        if self.request.user.is_staff:
            return HelpRequest.objects.raw('SELECT * FROM help_requests_helprequest')
        elif self.request.user.is_volunteer:
            approved = []
            for c in Competence:
                if CertificationRequest.IsCertified(self.request.user, c):
                    approved.append(c)

            return HelpRequest.objects.filter(service_type__in=approved).filter(Q(volunteer=None) | Q(volunteer=self.request.user)).distinct()
        else:
            queryset = HelpRequest.objects.raw(
                'SELECT * FROM help_requests_helprequest WHERE refugee_id = %s', [self.request.user.id])
        service_type = self.request.query_params.get('service_type', None)
        if service_type is not None:
            queryset = queryset.filter(service_type=service_type)
        return queryset

    def perform_create(self, serializer):
        if self.request.user.is_volunteer:
            raise ValidationError("Volunteers can't create help requests")
        serializer.save(refugee=self.request.user)


class AcceptHelpRequest(generics.GenericAPIView):
    permission_classes = [permissions.IsAdminUser | IsVolunteer]

    def post(self, request):
        # check if id is provided
        if not(request.data.get('request_id')):
            return Response({'error': 'id is required'}, status=status.HTTP_400_BAD_REQUEST)

        rId = base64.b64decode(request.data.get('request_id'))
        rId = pickle.loads(rId)
        # check if id is valid
        try:
            help_request = HelpRequest.objects.get(id=rId)
        except:
            return Response({'error': 'Invalid id'}, status=status.HTTP_400_BAD_REQUEST)

        if help_request is None:  # check if help request exists
            return Response({'error': 'Help Request does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        if help_request.volunteer is not None:  # check if help request is already taken
            return Response({'error': 'Help Request is already taken'}, status=status.HTTP_400_BAD_REQUEST)

        if help_request.finished:
            return Response({'error': 'Help Request is already finished'}, status=status.HTTP_400_BAD_REQUEST)

        volunteer = self.request.user

        help_request.volunteer = volunteer
        help_request.save()
        return Response(status=status.HTTP_200_OK)


class FinishHelpRequest(generics.GenericAPIView):
    permission_classes = [permissions.IsAdminUser | IsVolunteer]

    def post(self, request):
        # check if id is provided
        if not(request.data.get('request_id')):
            return Response({'error': 'id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:  # check if id is valid
            rId = request.data.get('request_id')
            help_request = HelpRequest.objects.raw(
                "SELECT * FROM help_requests_helprequest WHERE id = '%s'" % rId)[0]
        except:
            return Response({'error': 'Invalid id'}, status=status.HTTP_400_BAD_REQUEST)

        if help_request is None:  # check if help request exists
            return Response({'error': 'Help Request does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        if help_request.finished:
            return Response({'error': 'Help Request is already finished'}, status=status.HTTP_400_BAD_REQUEST)

        if help_request.volunteer != self.request.user:  # check if help request is already taken
            return Response({'error': 'Help Request is not taken by you'}, status=status.HTTP_400_BAD_REQUEST)

        help_request.finished = True
        help_request.save()
        return Response(status=status.HTTP_200_OK)
