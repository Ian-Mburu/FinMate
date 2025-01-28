from django.contrib import admin
from .models import CustomUser, Product, Orders  # Import your models

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'name', 'is_staff')
    search_fields = ('email', 'username')
    ordering = ('email',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'category', 'seller')
    search_fields = ('titl  e', 'category', 'seller__email')

@admin.register(Orders)
class OrdersAdmin(admin.ModelAdmin):
    list_display = ('owner', 'date', 'total_price', 'delivery_method')
    search_fields = ('owner__email',)
