from rest_framework import (
    response, status,
    permissions, exceptions,
    generics, viewsets,

)
from rest_framework.parsers import MultiPartParser, FormParser
from time import sleep
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound
from rest_framework.generics import (
    ListAPIView, GenericAPIView,
    RetrieveAPIView, CreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from doctor_profile.api.serializers import (
    DivisionSerializer, HospitalOrWorkplaceSerializer,
    SpecialtySerializer, DoctorProfileSerializer,
    DoctorProfileDetailSerializer, DoctorCreateSerializer,
    DoctorChamberSerializer, DoctorChamberDetailSerializer,
    VistingHourSerializer, DoctorChamberDetailSerializerCreateVersion,
    VistingHourSerializerCreate, DoctorProfileSerializerRUD,
    PaymentRefSerializer

)
from doctor_profile.models import (
    Division, HospitalOrWorkplace,
    Specialty, DoctorProfile,
    Chamber, VistingHour,
    PaymentRef,
)


class PaymentRefViewSet(viewsets.ModelViewSet):

    queryset = PaymentRef.objects.all()
    serializer_class = PaymentRefSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = None

    def get_queryset(self):

        return PaymentRef.objects.filter(doctor=self.request.user.doctor)

    def get_object(self):

        queryset = self.get_queryset()
        return get_object_or_404(queryset, doctor=self.request.user.doctor)

    def perform_create(self, serializer):

        doctor_profile = self.request.user.doctor
        serializer.save(doctor=doctor_profile)

    def update(self, request, *args, **kwargs):

        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        if instance.doctor != request.user.doctor:
            return Response({"detail": "Unauthorized access."}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):

        instance = self.get_object()

        if instance.doctor != request.user.doctor:
            return Response({"detail": "Unauthorized access."}, status=status.HTTP_403_FORBIDDEN)

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class DoctorProfileRetriveUpdateDelete(RetrieveUpdateDestroyAPIView):
    serializer_class = DoctorProfileSerializerRUD  # Updated serializer class
    permission_classes = (permissions.IsAuthenticated,)
    # Add parsers to handle multipart/form-data
    parser_classes = (MultiPartParser, FormParser,)

    def get_object(self):
        # Get the DoctorProfile instance for the authenticated user
        return get_object_or_404(DoctorProfile, user=self.request.user)

    def update(self, request, *args, **kwargs):
        # sleep(1)
        instance = self.get_object()

        # # Pass user info to request data to avoid user duplication issues
        # request.data['user'] = request.user.pk

        data = request.data.copy()
        # print(data)
        data['user'] = request.user.pk
        # if 'profile_picture' in request.FILES:
        #     data['profile_picture'] = request.FILES['profile_picture']

        # Pass the existing DoctorProfile instance to the serializer
        serializer = self.get_serializer(
            instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(DoctorProfileDetailSerializer(instance).data)


class VisitingHourCreateView(CreateAPIView):
    serializer_class = VistingHourSerializerCreate
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        get_chamber_pk = kwargs.get('pk')

        get_chamber = get_object_or_404(Chamber, pk=get_chamber_pk)
        request.data['chamber'] = get_chamber.pk
        request.data['doctor'] = request.user.doctor.pk

        serializer = self.get_serializer(data=request.data)

        try:

            serializer.is_valid(raise_exception=True)

            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except DjangoValidationError as e:
            # If Django ValidationError is raised in the model, return a JSON response
            return Response(
                {"detail": e.message_dict if hasattr(
                    e, 'message_dict') else e.messages},
                status=status.HTTP_400_BAD_REQUEST
            )
        except DRFValidationError as e:
            # Handle DRF validation errors
            return Response(
                {"detail": e.detail},
                status=status.HTTP_400_BAD_REQUEST
            )


class ChamberVisitingHourCreateView(CreateAPIView):
    serializer_class = DoctorChamberDetailSerializerCreateVersion
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Get the authenticated user's doctor profile
        doctor = self.request.user.doctor
        default_chamber = self.request.data.get('default_chamber')
        if default_chamber is not None:
            # chamber_pk = kwargs.get('pk')
            try:
                df_chm = Chamber.objects.filter(doctor__user=self.request.user).filter(
                    default_chamber=True).first()
                df_chm.default_chamber = False
                df_chm.save()

            except:
                ''

        # serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        return serializer.save(doctor=doctor)

        # try:
        #     serializer.is_valid(raise_exception=True)
        #     serializer.save(doctor=doctor)
        #     return Response(serializer.data)
        # except DjangoValidationError as e:
        #     # If Django ValidationError is raised in the model, return a JSON response
        #     return Response(
        #         {"detail": e.message_dict if hasattr(
        #             e, 'message_dict') else e.messages},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )
        # except DRFValidationError as e:
        #     # Handle DRF validation errors
        #     return Response(
        #         {"detail": e.detail},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )

    def create(self, request, *args, **kwargs):
        # Check if the doctor profile exists
        try:
            request.user.doctor
        except DoctorProfile.DoesNotExist:
            return Response(
                {"error": "Doctor profile not found for this user."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return super().create(request, *args, **kwargs)


class VistingHourUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = VistingHour.objects.all()
    serializer_class = VistingHourSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        # Filter visiting hours for the specific chamber and doctor
        return VistingHour.objects.filter(
            doctor=self.request.user.doctor.pk
        )

    def get_object(self):
        # Retrieve the specific VistingHour object using the pk
        return get_object_or_404(self.get_queryset(), pk=self.kwargs['pk'])

    def update(self, request, *args, **kwargs):
        # Get the specific visiting hour object
        current_obj = self.get_object()

        # Pass the object and request data to the serializer
        serializer = self.get_serializer(
            current_obj, data=request.data, partial=True
        )

        try:
            serializer.is_valid(raise_exception=True)
            # Save and return the updated data
            serializer.save()
            return Response(serializer.data)
        except DjangoValidationError as e:
            # If Django ValidationError is raised in the model, return a JSON response
            return Response(
                {"detail": e.message_dict if hasattr(
                    e, 'message_dict') else e.messages},
                status=status.HTTP_400_BAD_REQUEST
            )
        except DRFValidationError as e:
            # Handle DRF validation errors
            return Response(
                {"detail": e.detail},
                status=status.HTTP_400_BAD_REQUEST
            )


class DoctorChamberUDView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DoctorChamberDetailSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    lookup_url_kwarg = "pk"

    def update(self, request, *args, **kwargs):
        # Retrieve the chamber that needs to be updated
        chamber = self.get_object()

        # Ensure the doctor trying to update the chamber is the owner
        doctor_profile = DoctorProfile.objects.get(user=request.user)
        if chamber.doctor != doctor_profile:
            return Response({"detail": "Not authorized to update this chamber."}, status=status.HTTP_403_FORBIDDEN)
        default_chamber = request.data.get('default_chamber')
        if default_chamber is not None:
            # chamber_pk = kwargs.get('pk')
            try:
                df_chm = Chamber.objects.filter(doctor__user=request.user).filter(
                    default_chamber=True).first()
                df_chm.default_chamber = False
                df_chm.save()

            except:
                ''
            try:
                chamber.default_chamber = default_chamber  # Set the field directly
                chamber.save()  # Save the updated field
            except Exception as e:
                return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Proceed with the update by passing in the request data to the serializer
        serializer = self.get_serializer(
            chamber, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def get_queryset(self):
        # Ensure only chambers related to the authenticated doctor are fetched
        user = self.request.user
        return Chamber.objects.filter(doctor__user=user)

    def destroy(self, request, *args, **kwargs):
        # First, retrieve the chamber that needs to be deleted, ensuring it belongs to the doctor
        try:
            chamber = self.get_object()  # This will check the queryset defined above
        except Chamber.DoesNotExist:
            raise exceptions.ValidationError(
                {"detail": "Chamber not found or not authorized."})

        # Perform the deletion
        chamber.delete()

        # Return a custom response if necessary
        return Response({"detail": "Chamber deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class DoctorChamberRetriveView(ListAPIView):

    serializer_class = DoctorChamberSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        # sleep(6)

        # Get the logged-in user (doctor)
        user = self.request.user
        # Retrieve all chambers associated with the doctor
        return Chamber.objects.filter(doctor__user=user)


class DoctorProfileCreateAPIView(CreateAPIView):
    serializer_class = DoctorCreateSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        user = request.user

        # Check if the user already has a doctor profile
        if hasattr(user, 'doctor'):
            raise exceptions.ValidationError(
                {"detail": "Doctor profile already exists."})

        # Proceed with profile creation if no existing profile
        serializer = self.get_serializer(data=request.data)

        # Validate the data first
        serializer.is_valid(raise_exception=True)

        # Save the doctor profile with the appropriate workplace
        doctor_profile = serializer.save(
            user=user)

        # Serialize the newly created DoctorProfile
        doctor_profile_serializer = DoctorProfileSerializer(doctor_profile)

        # Return serialized data
        return Response(doctor_profile_serializer.data, status=status.HTTP_201_CREATED)


class DoctorDetailAPIPublicView(RetrieveAPIView):

    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileDetailSerializer
    permission_classes = (AllowAny,)
    lookup_url_kwarg = 'pk'

    def get_object(self):
        # Fetch the object using the default 'pk' lookup field, with error handling
        return get_object_or_404(DoctorProfile, pk=self.kwargs['pk'])


class FindSpecialtyOnDivision(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, *args, **kwargs):
        get_division = request.query_params.get('division', None)

        return Response


class FindDoctorsBySpecialORDivision(APIView):
    permission_classes = (AllowAny,)
    # def get(self, request, *args, **kwargs):
    #     # Extract query parameters from the request
    #     name = request.query_params.get('name', None)
    #     division = request.query_params.get('division', None)
    #     hospital = request.query_params.get('hospital', None)
    #     specialty = request.query_params.get('specialty', None)

    #     # Create a base queryset for DoctorProfile
    #     doctors = DoctorProfile.objects.all()

    #     # Apply filters dynamically
    #     if name:
    #         doctors = doctors.filter(
    #             first_name__icontains=name) | doctors.filter(last_name__icontains=name)

    #     if division:
    #         doctors = doctors.filter(division__name__iexact=division)

    #     if hospital:
    #         doctors = doctors.filter(workplace__name__iexact=hospital)

    #     if specialty:
    #         doctors = doctors.filter(specialty____iexact=specialty)

    #     # Serialize the filtered data
    #     serializer = DoctorProfileSerializer(doctors, many=True)

    #     # Return the filtered results
    #     return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request, *args, **kwargs):
        name = request.query_params.get('name', None)
        division_name = request.query_params.get('division', None)
        hospital_id = request.query_params.get('hospital_id', None)
        specialty_title = request.query_params.get('specialty', None)

        # Build query filters
        filters = {}
        if specialty_title:
            filters['specialty__title__icontains'] = specialty_title

        if division_name:
            filters['division__name__icontains'] = division_name

        if hospital_id:
            filters['workplace__id__iexact'] = hospital_id

        # Query filtered doctors
        doctors = DoctorProfile.objects.filter(**filters)

        # Filter by name if provided
        if name:
            doctors = doctors.filter(first_name__icontains=name) | doctors.filter(
                last_name__icontains=name)

        # Serialize the doctor data
        serializer = DoctorProfileSerializer(doctors, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class DivisionHospitalSpecialtyPublicSingleAPIView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, *args, **kwargs):
        divisions = Division.objects.all()
        hospitals = HospitalOrWorkplace.objects.all()
        specialty = Specialty.objects.all()

        divisions_serializers = DivisionSerializer(divisions, many=True)
        hospitals_serializers = HospitalOrWorkplaceSerializer(
            hospitals, many=True)
        specialty_serializers = SpecialtySerializer(specialty, many=True)

        # Combine both serialized data into the desired format
        response_data = {
            "specialties": specialty_serializers.data,
            "hospitals": hospitals_serializers.data,
            "divisions": divisions_serializers.data
        }

        return Response(response_data)
