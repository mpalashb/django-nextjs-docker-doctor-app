"django-admin shell or manage.py shell"

from django.contrib.auth import get_user_model
from doctor_profile.models import ProvideApprove, DoctorProfile
import random

User = get_user_model()

# Get the admin user with the email 'admin@palash.palash'
admin_user = User.objects.filter(email='admin@palash.palash').first()

if admin_user:
    # Fetch all the doctors
    doctors = DoctorProfile.objects.all()

    for doctor in doctors:
        # Get or create the ProvideApprove entry for the doctor
        provide_approve, created = ProvideApprove.objects.get_or_create(
            doctor=doctor)

        # Randomly approve and/or verify
        provide_approve.approved = random.choice(
            [True, False])  # Randomly approve
        provide_approve.verified = random.choice(
            [True, False])  # Randomly verify

        # Save the changes
        provide_approve.save()

    print("Approval and verification statuses have been updated for doctors.")
else:
    print("Admin with email 'admin@palash.palash' not found.")
