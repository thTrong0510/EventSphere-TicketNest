# Generated by Django 5.2 on 2025-05-15 19:46

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0017_alter_user_role'),
    ]

    operations = [
        migrations.RenameField(
            model_name='payment',
            old_name='payment_method',
            new_name='method',
        ),
        migrations.RemoveField(
            model_name='payment',
            name='ticket',
        ),
        migrations.AddField(
            model_name='payment',
            name='ticket_class',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='events.ticketclass'),
        ),
        migrations.AddField(
            model_name='payment',
            name='transaction_id',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='payment',
            name='status',
            field=models.CharField(choices=[('SUCCESS', 'Success'), ('FAILED', 'Failed'), ('PENDING', 'Pending')], default='PENDING', max_length=10),
        ),
    ]
