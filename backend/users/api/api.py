from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from doctor_profile.models import DoctorProfile
from django.contrib.auth import login
from django.contrib.auth import update_session_auth_hash

from rest_framework import permissions, views, generics, exceptions, response, status
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from users.api.serializers import (
    ReviewSerializer, UserSerializer,
    RegisterUserSerializer, UpdateDelUserSerializer,
)
from users.models import Review


class DeleteUserView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        self.perform_destroy(user)
        return Response({"detail": "User account deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = UpdateDelUserSerializer(
            user, data=request.data, context={'request': request})

        if serializer.is_valid(raise_exception=True):
            serializer.save()

            # Update session to avoid logout after password change
            if 'new_password' in request.data:
                update_session_auth_hash(request, user)

            return Response({"detail": "User details updated successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserRegister(generics.CreateAPIView):
    serializer_class = RegisterUserSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = serializer.save()
        except exceptions.ValidationError as e:
            raise exceptions.ValidationError(e.detail)

        return response.Response({
            "message": "User created successfully",
            "user": {
                "email": user.email
            }
        }, status=status.HTTP_201_CREATED)


class AuthMe(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        user = request.user
        if not user.is_active:
            raise exceptions.ValidationError(
                {"detail": "User account is inactive."})

        serializer = self.serializer_class(user)
        return response.Response(serializer.data)


class LoginView(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginView, self).post(request, format=None)


class WriteReview(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def perform_create(self, serializer):
        user = self.request.user

        doctor_id = self.request.data.get('doctor')
        try:
            doctor = DoctorProfile.objects.get(id=doctor_id)
        except DoctorProfile.DoesNotExist:
            raise exceptions.ValidationError(
                {"doctor": "Doctor does not exist."})

        doctor = serializer.validated_data['doctor']

        # Check if the user has already reviewed this doctor
        if Review.objects.filter(user=user, doctor=doctor).exists():
            raise exceptions.ValidationError(
                {"detail": "You have already reviewed this doctor."})

        serializer.save(user=user, doctor=doctor)

        return response.Response({
            "message": "Review created successfully",
            "review": serializer.data
        }, status=status.HTTP_201_CREATED)
