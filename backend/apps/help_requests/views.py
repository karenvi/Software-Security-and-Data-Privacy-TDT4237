import base64
import pickle
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
    """Viewset for help requests"""

    serializer_class = HelpRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'head', 'delete', 'post']

    def get_queryset(self):
        """Show own help requests if refugee, otherwise only show requests for which the user is certified and not already accepted by another volunteer"""

        if self.request.user.is_staff:
            return HelpRequest.objects.all()
        elif self.request.user.is_volunteer:
            approved = []
            for c in Competence:
                if CertificationRequest.IsCertified(self.request.user, c):
                    approved.append(c)

            return HelpRequest.objects.filter(service_type__in=approved).filter(Q(volunteer=None) | Q(volunteer=self.request.user)).distinct()
        else:
            queryset = HelpRequest.objects.filter(refugee=self.request.user)

        service_type = self.request.query_params.get('service_type', None)
        if service_type is not None:
            queryset = queryset.filter(service_type=service_type)
        return queryset

    def perform_create(self, serializer):
        """Create a help request for the current user if user is refugee"""
        if self.request.user.is_volunteer:
            raise ValidationError("Volunteers can't create help requests")
        if self.request.user.is_staff:
            raise ValidationError("Admins can't create help requests")
        serializer.save(refugee=self.request.user)

    def perform_destroy(self, instance):
        """Delete a help request"""
        if self.request.user != instance.refugee and not self.request.user.is_staff:
            raise ValidationError("Can only delete own help requests")
        instance.delete()


class AcceptHelpRequest(generics.GenericAPIView):
    """View for accepting a help request. Only POST method is allowed"""
    permission_classes = [IsVolunteer]

    def post(self, request):
        # check if id is provided
        if not(request.data.get('request_id')):
            return Response({'error': 'id is required'}, status=status.HTTP_400_BAD_REQUEST)

        # check if id is valid
        try:
            rId = base64.b64decode(request.data.get('request_id'))
            rId = pickle.loads(rId)
            help_request = HelpRequest.objects.raw(
                "SELECT * FROM help_requests_helprequest WHERE id = %s", [rId])[0]
        except:
            return Response({'error': 'Invalid id'}, status=status.HTTP_400_BAD_REQUEST)

        if help_request is None:  # check if help request exists
            return Response({'error': 'Help Request does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        if help_request.volunteer is not None:  # check if help request is already taken
            return Response({'error': 'Help Request is already taken'}, status=status.HTTP_400_BAD_REQUEST)

        if help_request.finished:  # check if help request is already finished
            return Response({'error': 'Help Request is already finished'}, status=status.HTTP_400_BAD_REQUEST)

        volunteer = self.request.user

        help_request.volunteer = volunteer
        help_request.save()
        return Response(status=status.HTTP_200_OK)


class FinishHelpRequest(generics.GenericAPIView):
    """View for finishing a help request. Only POST method is allowed"""
    permission_classes = [IsVolunteer]

    def post(self, request):
        # check if id is provided
        if not(request.data.get('request_id')):
            return Response({'error': 'id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:  # check if id is valid
            rId = request.data.get('request_id')
            help_requests = HelpRequest.objects.raw(
                "SELECT * FROM help_requests_helprequest WHERE id = '%s'" % rId)
            help_request = help_requests[0]
        except:
            return Response({'error': 'Invalid id'}, status=status.HTTP_400_BAD_REQUEST)
        if len(help_requests) == 1:
            if help_request is None:  # check if help request exists
                return Response({'error': 'Help Request does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            if help_request.finished:  # check if help request is already finished
                return Response({'error': 'Help Request is already finished'}, status=status.HTTP_400_BAD_REQUEST)

            if help_request.volunteer != self.request.user:  # check if help request is not taken by you
                return Response({'error': 'Help Request is not taken by you'}, status=status.HTTP_400_BAD_REQUEST)

            help_request.finished = True
            help_request.save()
            return Response(status=status.HTTP_200_OK)
        return Response(HelpRequestSerializer(help_requests, many=True).data, status=status.HTTP_200_OK)
