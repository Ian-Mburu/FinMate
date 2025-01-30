from rest_framework import serializers  # type: ignore
from .models import Product, CustomUser, Cart, CartItem, Wishlist, Order, OrderItem
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer # type: ignore
from django.contrib.auth import get_user_model



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Validate the user credentials
        data = super().validate(attrs)
        # Add custom user details to the response
        data['id'] = self.user.id
        data['username'] = self.user.username  # Add username to the response
        return data

    
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()  # Dynamic user model
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'telephone_no', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        email = validated_data.get('email')
        if get_user_model().objects.filter(email=email).exists():  # Use get_user_model
            raise serializers.ValidationError({"email": "This email is already in use."})

        username = validated_data.get('username')
        password = validated_data.get('password')

        if not username:
            raise serializers.ValidationError({"username": "This field is required."})
        
        if not password:
            raise serializers.ValidationError({"password": "This field is required."})

        user = get_user_model()(**validated_data)  # Use get_user_model to create user
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        avatar = validated_data.pop('avatar', None)
        
        if password:
            instance.set_password(password)
        if avatar:
            instance.avatar = avatar
            
        return super().update(instance, validated_data)

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'  #

class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.StringRelatedField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'total_price']
        read_only_fields = ['id', 'product', 'total_price']

    def get_total_price(self, obj):
        return obj.total_price

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_price', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def get_total_price(self, obj):
        return obj.total_price

class WishlistSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'products', 'product_id']
        read_only_fields = ['id']

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price']
        read_only_fields = ['product', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'total_price', 'status', 
            'created_at', 'shipping_address', 
            'payment_reference', 'items'
        ]
        read_only_fields = [
            'id', 'user', 'total_price', 'status',
            'created_at', 'payment_reference', 'items'
        ]