from django.db import models
from django.core.exceptions import ValidationError
from phone_field import PhoneField
from django.utils.translation import gettext_lazy as _
from PIL import Image
from django.conf import settings
from django.core.files.storage import default_storage as storage
from django.core.files.storage import default_storage
from storages.backends.s3boto3 import S3Boto3Storage
from django.core.files.base import ContentFile
from io import BytesIO
from django.core.files import File
from django.utils._os import safe_join  # Import this for safe path joining


User = settings.AUTH_USER_MODEL
DEBUG = settings.DEBUG
# DEBUG = False


class Specialty(models.Model):
    # Reduced length to 100, usually sufficient for titles
    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title


class HospitalOrWorkplace(models.Model):
    # Optimized for common name length of hospitals
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Division(models.Model):
    name = models.CharField(max_length=100, default='Dhaka')

    def __str__(self) -> str:
        return f"{self.name}"


class DoctorProfile(models.Model):
    class ChoiseSex(models.TextChoices):
        MALE = "male", _("Male")
        FEMALE = "female", _("Female")

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='doctor')
    # 50 is a common limit for first names
    first_name = models.CharField(max_length=50, blank=True)
    # Same as above for last names
    last_name = models.CharField(max_length=50, blank=True)
    profile_picture = models.ImageField(upload_to="profiles/", blank=True)
    sex = models.CharField(max_length=6, choices=ChoiseSex.choices,
                           default=ChoiseSex.MALE)  # 6 to fit "female" or "male"
    email = models.EmailField(blank=True, null=True)
    phone = PhoneField(help_text="Add your phone number",
                       blank=True, null=True)
    division = models.ForeignKey(
        Division, on_delete=models.CASCADE, default=1)

    qualifications = models.TextField()  # No max length as it might be variable
    specialty = models.ManyToManyField(
        Specialty, related_name="doctors", related_query_name="doctor")
    workplace = models.ForeignKey(
        HospitalOrWorkplace, on_delete=models.CASCADE, related_name="doctors")
    # Reduced to 100, suitable for most job titles
    designation = models.CharField(max_length=100)

    def check_profile_picture(self):
        if not self.profile_picture or not self.profile_picture.name:
            if DEBUG:
                # Local environment: serve static files
                if self.sex == self.ChoiseSex.MALE:
                    default_image_path = safe_join(
                        'static', 'doctors_default', 'male.jpg')
                else:
                    default_image_path = safe_join(
                        'static', 'doctors_default', 'female.jpg')

                # Set the default profile picture path locally
                self.profile_picture = default_image_path
            else:
                if self.sex == self.ChoiseSex.MALE:
                    default_image_path = 'doctors_default/male.jpg'
                else:
                    default_image_path = 'doctors_default/female.jpg'

                self.profile_picture = default_image_path

    def resize_image(self):
        if DEBUG:
            if self.profile_picture:
                img_path = self.profile_picture.path
                img = Image.open(img_path)

                # Set the maximum size for the image
                max_size = (300, 300)

                # Resize the image if it's larger than the maximum size
                img.thumbnail(max_size)

                # Save the resized image back to the same location
                img.save(img_path)
        else:

            img = Image.open(self.profile_picture)

            # Set the maximum size for the image
            max_size = (300, 300)

            # Resize the image if it's larger than the maximum size
            img.thumbnail(max_size)

            # Save the resized image to an in-memory file
            img_format = img.format or 'JPEG'  # Use the original format or default to JPEG
            img_io = BytesIO()
            img.save(img_io, format=img_format)
            img_io.seek(0)

            # Upload the resized image back to S3 using the same file name
            resized_image = ContentFile(img_io.getvalue())
            self.profile_picture.save(
                self.profile_picture.name, resized_image, save=False
            )

    def save(self, *args, **kwargs):
        self.check_profile_picture()

        # Resize only if the profile_picture is not a default URL
        if self.profile_picture and not self.profile_picture.name.startswith('https://'):
            try:
                self.resize_image()
            except Exception as e:
                print(f"Error resizing image: {e}")

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Doctor PK: {self.pk} | Dr. {self.first_name} {self.last_name}"

    @property
    def approved(self):
        # Checks the related ProvideApprove instance to get approval status
        return self.approval.approved if hasattr(self, 'approval') else False

    @property
    def verified(self):
        # Checks the related ProvideApprove instance to get approval status
        return self.approval.verified if hasattr(self, 'approval') else False

    @property
    def average_rating(self):
        if self.reviews:
            reviews = self.reviews.all()
            # Check if there are any reviews
            if reviews.exists():
                # Calculate the average rating
                total_rating = sum(review.rating for review in reviews)
                return total_rating / reviews.count()
        return 0.00  # Return 0 if there are no reviews

    @property
    def reviews_count(self):
        # Count the number of related reviews
        return self.reviews.count() if self.reviews else 0


class Chamber(models.Model):
    doctor = models.ForeignKey(
        DoctorProfile, on_delete=models.CASCADE, related_name="chambers")
    default_chamber = models.BooleanField(default=False)
    # Shortened to 150 as chamber names are generally not too long
    chamber_name = models.CharField(max_length=150)
    # Optimized to 300 for more detailed addresses
    chamber_address = models.CharField(max_length=300)

    appointment_number = PhoneField(
        help_text="Mobile Number (For Appointment)", blank=True, null=True)

    def clean(self):
        if self.default_chamber:
            if Chamber.objects.filter(doctor=self.doctor, default_chamber=True).exclude(pk=self.pk).exists():
                raise ValidationError(
                    "Each doctor can have only one default chamber.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.chamber_name} ({self.doctor.user})"


# class CloseDay(models.Model):
#     class ClosedDays(models.TextChoices):
#         SUN = 'sun', _("Sunday")
#         MON = 'mon', _("Monday")
#         TUE = 'tue', _("Tuesday")
#         WED = 'wed', _("Wednesday")
#         THU = 'thu', _("Thursday")
#         FRI = 'fri', _("Friday")
#         SAT = 'sat', _("Saturday")

#     chamber = models.ForeignKey(
#         Chamber, on_delete=models.CASCADE, related_name='close_days')
#     doctor = models.ForeignKey(
#         DoctorProfile, on_delete=models.CASCADE, related_name='close_days')
#     closed_days = models.CharField(
#         max_length=3, choices=ClosedDays.choices, default=ClosedDays.FRI)


class VistingHour(models.Model):
    class ChooseDays(models.TextChoices):
        SUN = 'sun', _("Sunday")
        MON = 'mon', _("Monday")
        TUE = 'tue', _("Tuesday")
        WED = 'wed', _("Wednesday")
        THU = 'thu', _("Thursday")
        FRI = 'fri', _("Friday")
        SAT = 'sat', _("Saturday")

    chamber = models.ForeignKey(
        Chamber, on_delete=models.CASCADE, related_name='visiting_hours')
    doctor = models.ForeignKey(
        DoctorProfile, on_delete=models.CASCADE, related_name='visiting_hours')
    visiting_hour_start = models.TimeField()
    visiting_hour_end = models.TimeField()
    day = models.CharField(
        max_length=3, choices=ChooseDays.choices, default=ChooseDays.SAT)

    def __str__(self):
        return f"{self.chamber.chamber_name} ({self.doctor.user})"

    def clean(self):
        # Ensure the visiting hours are logical
        if self.visiting_hour_end <= self.visiting_hour_start:
            raise ValidationError(
                "Visiting hour end time must be after start time.")

    def save(self, *args, **kwargs):
        self.clean()  # Call clean method to validate visiting hours
        super().save(*args, **kwargs)


class PaymentRef(models.Model):
    doctor = models.OneToOneField(DoctorProfile, on_delete=models.CASCADE)
    # Shortened to 100 to suit most payment methods
    method = models.CharField(max_length=100)
    phone = PhoneField(help_text='Payment phone number')
    transaction_ref = models.CharField(max_length=100)

    def __str__(self):
        return f"Payment Method: {self.method} for Dr. {self.doctor.first_name}"


class ProvideApprove(models.Model):
    doctor = models.OneToOneField(
        DoctorProfile, on_delete=models.CASCADE, related_name='approval')
    approved = models.BooleanField(default=False)
    verified = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"Approved: {self.approved} for Dr. {self.doctor.first_name} {self.doctor.last_name}"

    @property
    def doctor_name(self):
        return f"User ID/PK: {self.doctor.user.pk} | Doctor ID/PK: {self.doctor.pk} | Dr. {self.doctor.first_name} {self.doctor.last_name}"


# class Review(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     doctor = models.ForeignKey(
#         DoctorProfile, on_delete=models.CASCADE, related_name='reviews')
#     rating = models.IntegerField(default=0)

#     def save(self, *args, **kwargs):
#         # Check if the user has already reviewed this doctor
#         if Review.objects.filter(user=self.user, doctor=self.doctor).exists():
#             raise ValidationError("You have already reviewed this doctor.")
#         super().save(*args, **kwargs)
