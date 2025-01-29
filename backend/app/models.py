from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.contrib.postgres.fields import ArrayField



class CustomUser(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)  # Ensure email is unique
    name = models.CharField(max_length=200, unique=True)
    bio = models.TextField(null=True)
    avatar = models.ImageField(default="../media/cat.png", null=True)
    telephone_no = models.CharField(max_length=15, null=True, blank=True) 

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']  

    def __str__(self):
        return self.username


class Product(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='uploads/images')
    created_at = models.DateField(auto_now_add=True)
    quantity = models.PositiveIntegerField(default=0)
    rating = models.PositiveSmallIntegerField(default=0)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'products'