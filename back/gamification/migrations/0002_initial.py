# Generated by Django 5.1.4 on 2025-01-09 17:29

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('gamification', '0001_initial'),
        ('places', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='badge',
            name='users',
            field=models.ManyToManyField(blank=True, related_name='badges', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='level',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='mission',
            name='badge',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='gamification.badge'),
        ),
        migrations.AddField(
            model_name='mission',
            name='target_place',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='places.place'),
        ),
        migrations.AddField(
            model_name='mission',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]