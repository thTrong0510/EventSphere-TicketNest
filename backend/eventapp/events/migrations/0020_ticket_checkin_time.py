# Generated by Django 5.2 on 2025-05-16 18:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0019_remove_ticket_status_ticket_checked_in'),
    ]

    operations = [
        migrations.AddField(
            model_name='ticket',
            name='checkin_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
