# Generated by Django 5.0 on 2024-10-13 08:45

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('doctor_profile', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='doctorprofile',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='doctor', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='closeday',
            name='doctor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='close_days', to='doctor_profile.doctorprofile'),
        ),
        migrations.AddField(
            model_name='chamber',
            name='doctor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chambers', to='doctor_profile.doctorprofile'),
        ),
        migrations.AddField(
            model_name='doctorprofile',
            name='workplace',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='doctors', to='doctor_profile.hospitalorworkplace'),
        ),
        migrations.AddField(
            model_name='paymentref',
            name='doctor',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='doctor_profile.doctorprofile'),
        ),
        migrations.AddField(
            model_name='provideapprove',
            name='doctor',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='approval', to='doctor_profile.doctorprofile'),
        ),
        migrations.AddField(
            model_name='doctorprofile',
            name='specialty',
            field=models.ManyToManyField(related_name='doctors', related_query_name='doctor', to='doctor_profile.specialty'),
        ),
        migrations.AddField(
            model_name='vistinghour',
            name='chamber',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='visiting_hours', to='doctor_profile.chamber'),
        ),
        migrations.AddField(
            model_name='vistinghour',
            name='doctor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='visiting_hours', to='doctor_profile.doctorprofile'),
        ),
    ]