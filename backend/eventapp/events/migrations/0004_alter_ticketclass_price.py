# Generated by Django 5.2 on 2025-05-04 19:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0003_remove_ticketclass_seat_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ticketclass',
            name='price',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
