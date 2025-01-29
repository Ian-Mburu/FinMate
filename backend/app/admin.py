from django.contrib import admin
from .models import CustomUser, Product # Import your models

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'name', 'is_staff')
    search_fields = ('email', 'username')
    ordering = ('email',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'price',)
    search_fields = ('title',)