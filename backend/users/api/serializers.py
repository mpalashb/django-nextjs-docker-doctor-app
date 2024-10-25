from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from users.models import Review
from doctor_profile.api.serializers import DoctorProfileDetailSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class UpdateDelUserSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(
        write_only=True, required=False, min_length=8)
    new_username_email = serializers.EmailField(required=False)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate_new_username_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This user is already taken.")
        return value

    def update(self, instance, validated_data):
        user = instance

        if 'new_password' in validated_data and validated_data['new_password']:
            user.set_password(validated_data['new_password'])

        if 'new_username_email' in validated_data and validated_data['new_username_email']:
            user.email = validated_data['new_username_email']

        user.save()
        return user


class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("email", "password")

    # Overriding create method to hash the password
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class ReviewSerializer(ModelSerializer):

    class Meta:
        model = Review
        exclude = ['user']


class UserSerializer(ModelSerializer):
    doctor = DoctorProfileDetailSerializer()

    class Meta:
        model = User
        # fields = "__all__"
        exclude = ("password",)
