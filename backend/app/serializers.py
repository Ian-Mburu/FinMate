from rest_framework import serializers  # type: ignore
from .models import Product, CustomUser
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