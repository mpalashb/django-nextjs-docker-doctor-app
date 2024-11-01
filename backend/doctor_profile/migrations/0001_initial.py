# Generated by Django 5.0 on 2024-10-13 08:45

import django.db.models.deletion
import phone_field.models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Chamber',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('default_chamber', models.BooleanField(default=False)),
                ('chamber_name', models.CharField(max_length=150)),
                ('chamber_address', models.CharField(max_length=300)),
                ('appointment_number', phone_field.models.PhoneField(blank=True, help_text='Mobile Number (For Appointment)', max_length=31, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Division',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='Dhaka', max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='HospitalOrWorkplace',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='PaymentRef',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('method', models.CharField(max_length=100)),
                ('phone', phone_field.models.PhoneField(help_text='Payment phone number', max_length=31)),
                ('transaction_ref', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='ProvideApprove',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('approved', models.BooleanField(default=False)),
                ('verified', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Specialty',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='VistingHour',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visiting_hour_start', models.TimeField()),
                ('visiting_hour_end', models.TimeField()),
                ('day', models.CharField(choices=[('sun', 'Sunday'), ('mon', 'Monday'), ('tue', 'Tuesday'), ('wed', 'Wednesday'), ('thu', 'Thursday'), ('fri', 'Friday'), ('sat', 'Saturday')], default='sat', max_length=3)),
            ],
        ),
        migrations.CreateModel(
            name='CloseDay',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('closed_days', models.CharField(choices=[('sun', 'Sunday'), ('mon', 'Monday'), ('tue', 'Tuesday'), ('wed', 'Wednesday'), ('thu', 'Thursday'), ('fri', 'Friday'), ('sat', 'Saturday')], default='fri', max_length=3)),
                ('chamber', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='close_days', to='doctor_profile.chamber')),
            ],
        ),
        migrations.CreateModel(
            name='DoctorProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(blank=True, max_length=50)),
                ('last_name', models.CharField(blank=True, max_length=50)),
                ('profile_picture', models.ImageField(blank=True, upload_to='profiles/')),
                ('sex', models.CharField(choices=[('male', 'Male'), ('female', 'Female')], default='male', max_length=6)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('phone', phone_field.models.PhoneField(blank=True, help_text='Add your phone number', max_length=31, null=True)),
                ('qualifications', models.TextField()),
                ('designation', models.CharField(max_length=100)),
                ('division', models.ForeignKey(default='Dhaka', on_delete=django.db.models.deletion.CASCADE, to='doctor_profile.division')),
            ],
        ),
    ]
