# Generated by Django 5.1.6 on 2025-02-12 06:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='wishlist',
            name='products',
            field=models.ManyToManyField(blank=True, to='app.product'),
        ),
    ]
