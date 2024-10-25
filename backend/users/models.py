from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from doctor_profile.models import DoctorProfile


from django.contrib.auth.models import AbstractBaseUser
from users.user_manager import MyUserManager


class User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name="email address",
        max_length=255,
        unique=True,
    )
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = MyUserManager()

    USERNAME_FIELD = "email"

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    doctor = models.ForeignKey(
        DoctorProfile, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(default=0)

    class Meta:
        # Ensures unique user-doctor pairs
        unique_together = ('user', 'doctor')

    def clean(self) -> None:
        if self.rating < 0 or self.rating > 5:
            raise ValidationError("Rating must be between 0 and 5.")
        return super().clean()

    def save(self, *args, **kwargs):
        self.clean()

        super().save(*args, **kwargs)
