"django-admin shell or manage.py shell"

from django.contrib.auth import get_user_model
from doctor_profile.models import DoctorProfile, Specialty, Division, HospitalOrWorkplace, Chamber, VistingHour, CloseDay
from users.models import ProvideApprove
from phone_field import PhoneField
from django.core.files import File
import os
import random
from django.conf import settings
from django.db.utils import IntegrityError


def get_random_profile_picture(sex):
    base_dir = os.path.join(settings.BASE_DIR, 'dummy_picture')
    if sex == "male":
        picture_path = os.path.join(base_dir, 'male.jpg')
    else:
        picture_path = os.path.join(base_dir, 'female.jpg')

    # Open the file and return as a File object
    return File(open(picture_path, 'rb'))


def create_doctor_profile():
    User = get_user_model()

    # Create a random user for the doctor
    username = f"dr{random.randint(1, 100)}"
    email = f"{username}@example.com"
    phone_number = f"017{random.randint(10000000, 99999999)}"

    # Create or get a user
    user = User.objects.create_user(email=email, password='password123')

    # Random choices for doctor attributes
    first_name = f"First{random.randint(1, 100)}"
    last_name = f"Last{random.randint(1, 100)}"
    sex = random.choice(["male", "female"])
    division = Division.objects.order_by('?').first()  # Get a random division
    specialty = Specialty.objects.order_by(
        '?').first()  # Get a random specialty
    workplace = HospitalOrWorkplace.objects.order_by(
        '?').first()  # Get a random workplace
    designation = f"Designation{random.randint(1, 10)}"
    qualifications = f"Qualification{random.randint(1, 5)}"

    # Create the doctor profile
    profile = DoctorProfile.objects.create(
        user=user,
        first_name=first_name,
        last_name=last_name,
        sex=sex,
        phone=phone_number,
        division=division,
        designation=designation,
        qualifications=qualifications,
        workplace=workplace
    )

    # Assign random profile picture
    profile.profile_picture.save(
        f"{username}_profile.jpg", get_random_profile_picture(sex))

    # Add random specialty to the doctor
    profile.specialty.add(specialty)

    # Save the profile
    profile.save()

    print(f"Created doctor profile: {profile}")

    return profile


def create_chamber_and_schedule(doctor_profile):
    # Create multiple chambers for the doctor
    for i in range(1, random.randint(2, 4)):  # Each doctor can have 2-3 chambers
        chamber_name = f"Chamber{i} for Dr.{doctor_profile.last_name}"
        chamber_address = f"Address {i}, Dhaka, Bangladesh"
        appointment_number = f"018{random.randint(10000000, 99999999)}"

        # Create the chamber
        chamber = Chamber.objects.create(
            doctor=doctor_profile,
            chamber_name=chamber_name,
            chamber_address=chamber_address,
            appointment_number=appointment_number,
            default_chamber=(i == 1)  # First chamber is set as default
        )

        print(f"Created chamber: {chamber}")

        # Add visiting hours to the chamber
        for day in ['sat', 'sun', 'mon']:  # Example days
            start_hour = random.randint(9, 14)
            end_hour = random.randint(15, 20)
            visiting_hour = VistingHour.objects.create(
                chamber=chamber,
                doctor=doctor_profile,
                visiting_hour_start=f"{start_hour}:00",
                visiting_hour_end=f"{end_hour}:00",
                day=day
            )
            print(f"Created visiting hours: {visiting_hour}")

        # Add closed days
        CloseDay.objects.create(
            chamber=chamber,
            doctor=doctor_profile,
            closed_days=random.choice(['fri', 'thu'])
        )

        print(f"Closed day added for chamber: {chamber}")


def create_doctors_with_chambers_and_schedules(num_doctors):
    for _ in range(num_doctors):
        try:
            # Create doctor profile
            doctor_profile = create_doctor_profile()

            # Create chamber, visiting hours, and closed days for the doctor
            create_chamber_and_schedule(doctor_profile)
        except IntegrityError as e:
            print(f"Error creating doctor: {e}")
        except Exception as e:
            print(f"General error: {e}")


# Call the function to create a specific number of doctors with chambers
create_doctors_with_chambers_and_schedules(5)


def approve_and_verify_doctors(admin_email='admin@palash.palash'):
    User = get_user_model()

    # Fetch admin user by email
    admin_user = User.objects.filter(email=admin_email).first()

    if admin_user:
        doctors = DoctorProfile.objects.all()

        for doctor in doctors:
            provide_approve, created = ProvideApprove.objects.get_or_create(
                doctor=doctor)
            provide_approve.approved = random.choice(
                [True, False])  # Randomly approve
            provide_approve.verified = random.choice(
                [True, False])  # Randomly verify
            provide_approve.save()

        print("Doctors have been randomly approved and verified.")
    else:
        print("Admin user not found.")


# Create doctors and their related chambers and schedules
create_doctors_with_chambers_and_schedules(5)

# Approve and verify doctors by the admin
approve_and_verify_doctors()
