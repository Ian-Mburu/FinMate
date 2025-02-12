from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings



class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    # Remove duplicate name field if using AbstractUser's first_name/last_name
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    bio = models.TextField(null=True, blank=True)
    avatar = models.ImageField(default="cat.png", upload_to='avatars/')
    telephone_no = models.CharField(max_length=15, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


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

class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def total_price(self):
        return sum(item.total_price for item in self.items.all())

class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey(
        'Product',
        on_delete=models.CASCADE
    )
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    @property
    def total_price(self):
        return self.product.price * self.quantity

    class Meta:
        unique_together = ('cart', 'product')

class Wishlist(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='wishlist'
    )
    products = models.ManyToManyField('Product')
    created_at = models.DateTimeField(auto_now_add=True)

class Order(models.Model):
    ORDER_STATUS = [
        ('P', 'Pending'),
        ('C', 'Completed'),
        ('F', 'Failed')
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='orders'
    )
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=1, choices=ORDER_STATUS, default='P')
    created_at = models.DateTimeField(auto_now_add=True)
    shipping_address = models.TextField()
    payment_reference = models.CharField(max_length=255, blank=True)

class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey('Product', on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)