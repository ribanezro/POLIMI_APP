# Generated by Django 5.1.4 on 2025-01-03 10:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('places', '0002_alter_place_image_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='place',
            name='website',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
    ]
