from django.db.utils import IntegrityError
from rest_framework import permissions, viewsets, generics, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import CertificationRequest, Status
from .serializers import CertificationRequestSerializer
from .permissions import IsVolunteer
# Create your views here.


class CertificationRequestViewSet(viewsets.ModelViewSet):
    serializer_class = CertificationRequestSerializer
    permission_classes = [permissions.IsAdminUser | IsVolunteer]

    http_method_names = ['get', 'head', 'delete', 'post']

    def get_queryset(self):
        if self.request.user.is_staff:
            return CertificationRequest.objects.all()
        return CertificationRequest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except IntegrityError as e:
            raise ValidationError(
                'An identical Certification Request already exists')


class AnswerCertificationRequest(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        # check if id and status is provided
        if not(request.data.get('id') and request.data.get('status')):
            return Response({'error': 'id and status is required'}, status=status.HTTP_400_BAD_REQUEST)

        certification_request = CertificationRequest.objects.get(
            id=request.data['id'])

        if certification_request is None:  # check if certification request exists
            return Response({'error': 'Certification Request does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        if certification_request.status != 'P':  # check if certification request is pending
            return Response({'error': 'Certification Request is not pending'}, status=status.HTTP_400_BAD_REQUEST)

        state = request.data['status']

        if state == 'A':  # if accepted
            certification_request.status = Status.ACCEPTED
        elif state == 'D':  # if declined
            certification_request.status = Status.DECLINED
        else:
            return Response({'error': 'Status must be A or D'}, status=status.HTTP_400_BAD_REQUEST)
        certification_request.save()
        return Response(status=status.HTTP_200_OK)
