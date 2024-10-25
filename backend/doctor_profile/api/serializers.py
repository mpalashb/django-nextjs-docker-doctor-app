from rest_framework import serializers, exceptions
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.serializers import ModelSerializer
from doctor_profile.models import (
    Specialty,
    HospitalOrWorkplace,
    Division,
    DoctorProfile,
    Chamber,
    VistingHour,
    ProvideApprove,
    PaymentRef,
)


class PaymentRefSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(
        source='doctor.first_name', read_only=True)  # Add doctor's name if needed

    class Meta:
        model = PaymentRef
        fields = ['id', 'method', 'phone', 'transaction_ref',
                  'doctor_name']  # Include doctor_name for display
        read_only_fields = ['doctor_name']


class DoctorProfileSerializerRUD(serializers.ModelSerializer):
    workplace = serializers.PrimaryKeyRelatedField(
        queryset=HospitalOrWorkplace.objects.all(),
        required=False,  # Make it optional
        allow_null=True  # Allow null values
    )
    workplace_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = DoctorProfile
        exclude = ("user", )

    def validate(self, attrs):
        # If workplace_name is provided, create or fetch the workplace
        if attrs.get('workplace_name'):
            workplace, created = HospitalOrWorkplace.objects.get_or_create(
                name=attrs.get('workplace_name'))
            attrs['workplace'] = workplace

        return attrs

    def update(self, instance, validated_data):
        # Remove workplace_name as it is not part of DoctorProfile fields
        validated_data.pop('workplace_name', None)

        # Call super to update the DoctorProfile instance
        return super().update(instance, validated_data)


class VistingHourSerializerCreate(ModelSerializer):
    class Meta:
        model = VistingHour
        fields = "__all__"


class VistingHourSerializer(ModelSerializer):
    class Meta:
        model = VistingHour
        exclude = ("doctor", "chamber",)


class DoctorChamberDetailSerializerCreateVersion(ModelSerializer):
    visiting_hours = VistingHourSerializer(many=True, required=False)

    class Meta:
        model = Chamber
        exclude = ("doctor",)

    def create(self, validated_data):
        visiting_hours_data = validated_data.pop('visiting_hours', [])
        doctor = self.context['request'].user.doctor
        # print(validated_data)
        # print(visiting_hours_data)
        # Create the chamber
        chamber = Chamber.objects.create(**validated_data)
        # print(visiting_hours_data)
        # Create the visiting hours linked to the chamber
        try:
            for vh_data in visiting_hours_data:
                VistingHour.objects.create(
                    chamber=chamber, doctor=doctor, **vh_data)
        except DjangoValidationError as e:
            # If Django ValidationError is raised in the model, return a JSON response

            raise exceptions.ValidationError({"detail": e.message_dict if hasattr(
                e, 'message_dict') else e.messages})

        return chamber


class DoctorChamberDetailSerializer(ModelSerializer):

    class Meta:
        model = Chamber
        exclude = ("doctor", )


class DoctorCreateSerializer(ModelSerializer):
    workplace = serializers.PrimaryKeyRelatedField(
        queryset=HospitalOrWorkplace.objects.all(),
        required=False,  # Set to False to make it optional
        allow_null=True  # Allow null if the field is not provided
    )
    workplace_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = DoctorProfile
        exclude = ("user", )

    def validate(self, attrs):
        # print(attrs)
        if attrs.get('workplace_name'):
            workplace = HospitalOrWorkplace.objects.create(
                name=attrs.get('workplace_name'))
            attrs['workplace'] = workplace

        return super().validate(attrs)

    def create(self, validated_data):
        # to remove TypeError: DoctorProfile() got unexpected keyword arguments: 'workplace_name'
        validated_data.pop('workplace_name', None)
        doctor_profile = super().create(validated_data)
        doctor_profile.workplace = validated_data['workplace']  # Set workplace
        doctor_profile.save()  # Save the doctor profile with the workplace

        return doctor_profile


class ProvideApproveSerializer(ModelSerializer):
    class Meta:
        model = ProvideApprove
        fields = ("approved", )


class SpecialtySerializer(ModelSerializer):
    class Meta:
        model = Specialty
        fields = "__all__"


class DivisionSerializer(ModelSerializer):
    class Meta:
        model = Division
        fields = "__all__"


class HospitalOrWorkplaceSerializer(ModelSerializer):
    class Meta:
        model = HospitalOrWorkplace
        fields = "__all__"


class DoctorProfileSerializer(ModelSerializer):
    division = DivisionSerializer()
    workplace = HospitalOrWorkplaceSerializer()
    specialty = SpecialtySerializer(many=True)

    class Meta:
        model = DoctorProfile
        fields = "__all__"


'============================================================='


# class DoctorCloseDaysSerializer(ModelSerializer):
#     closed_days = serializers.SerializerMethodField()

#     class Meta:
#         model = CloseDay
#         fields = "__all__"
#         # fields = ('closed_days',)

#     def get_closed_days(self, obj):
#         closed_day_display = obj.get_closed_days_display()
#         return closed_day_display


class DoctorVistingHourSerializer(ModelSerializer):
    # day = serializers.SerializerMethodField()
    # visiting_hour_start = serializers.SerializerMethodField()
    # visiting_hour_end = serializers.SerializerMethodField()

    class Meta:
        model = VistingHour
        fields = "__all__"

    # def get_day(self, obj):
    #     return obj.get_day_display()

    # def get_visiting_hour_start(self, obj):
    #     # Convert visiting_hour_start to AM/PM format
    #     if obj.visiting_hour_start:
    #         return obj.visiting_hour_start.strftime('%I:%M %p')
    #     return None

    # def get_visiting_hour_end(self, obj):
    #     # Convert visiting_hour_end to AM/PM format
    #     if obj.visiting_hour_end:
    #         return obj.visiting_hour_end.strftime('%I:%M %p')
    #     return None


class DoctorChamberSerializer(ModelSerializer):
    visiting_hours = DoctorVistingHourSerializer(many=True)
    # close_days = DoctorCloseDaysSerializer(many=True)

    class Meta:
        model = Chamber
        fields = "__all__"


class DoctorProfileDetailSerializer(DoctorProfileSerializer):
    approved = serializers.BooleanField()
    verified = serializers.BooleanField()
    # Change to FloatField for the average
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.IntegerField()  # Change to IntegerField for count
    # approval = serializers.SerializerMethodField()
    chambers = DoctorChamberSerializer(many=True)

    # def get_approval(self, obj):
    #     if hasattr(obj, 'approval'):
    #         return obj.approval.approved
    #     return None

    def get_average_rating(self, obj):
        if obj.average_rating:
            return round(obj.average_rating, 2)
        return 0.00
