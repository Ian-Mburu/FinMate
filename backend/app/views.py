from rest_framework import viewsets, permissions, generics, status # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.decorators import api_view, authentication_classes, permission_classes, action # type: ignore
from django.http import JsonResponse
from .models import Product, CustomUser, Wishlist, Cart, Order
from rest_framework.permissions import IsAuthenticated # type: ignore
from .serializers import ProductSerializer, CustomUserSerializer, CartSerializer, WishlistSerializer, OrderSerializer 
from .permissions import IsOwnerOrReadOnly
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView # type: ignore
from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer # type: ignore
from django.contrib import messages
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication  
from rest_framework.parsers import MultiPartParser, FormParser





class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['id'] = user.id
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['id'] = self.user.id  # Add the ID to the response
        return data


class ProductsView(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-title')
    serializer_class = ProductSerializer
    permission_classes = (
        permissions.IsAuthenticatedOrReadOnly,
        IsOwnerOrReadOnly
    )

    def create(self, request, *args, **kwargs):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            # Redirect to the signup endpoint
            return Response(
                {"detail": "Please sign up to add products."}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)  # Save the seller



def userProfile(request, username):
    user = get_object_or_404(CustomUser, username=username)
    data = {
        'id': user.id,
        'name': user.username,
        'email': user.email,
        'bio': user.bio,
        'avatar': user.avatar.url if user.avatar else '/media/cat.png',
    }
    return JsonResponse(data)


class updateUserprofileView(RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  

    def get_object(self):
        return self.request.user

    def perform_update(self, serializer):
        if 'avatar' in self.request.FILES:
            serializer.validated_data['avatar'] = self.request.FILES['avatar']
        serializer.save()

@api_view(['GET'])
def search_products(request):
    query = request.GET.get('q', '')
    if query:
        products = Product.objects.filter(title__icontains=query)  # Adjusted filtering
    else:
        products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


class SignUpView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def perform_create(self, serializer):
        # Save user instance
        user = serializer.save()

        # After successful registration, redirect to login page with success message
        messages.success(self.request, 'Registration successful! You can now log in.')
        return user


@api_view(['GET'])
@authentication_classes([JWTAuthentication])  # Changed from TokenAuthentication
@permission_classes([IsAuthenticated])
def current_user(request):
    if request.user.is_authenticated:
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'name': user.name,
            'telephone_no': user.telephone_no,
            'bio': user.bio,
            'avatar': user.avatar.url if user.avatar else '/media/cat.png'  # Provide default
        })
    return Response({'detail': 'Not authenticated'}, status=401)


# views.py
class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        serializer = CartAddItemSerializer(data=request.data)
        if serializer.is_valid():
            try:
                product = Product.objects.get(id=serializer.validated_data['product_id'])
            except Product.DoesNotExist:
                return Response(
                    {"error": "Product not found"}, 
                    status=status.HTTP_404_NOT_FOUND
                )

            cart, _ = Cart.objects.get_or_create(user=request.user)
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'quantity': serializer.validated_data['quantity']}
            )

            if not created:
                cart_item.quantity += serializer.validated_data['quantity']
                cart_item.save()

            return Response(
                CartSerializer(cart, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# views.py
class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def add_product(self, request):
        try:
            product_id = request.data.get('product_id')
            if not product_id:
                return Response(
                    {"error": "product_id is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            product = Product.objects.get(id=product_id)
            wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
            
            if wishlist.products.filter(id=product.id).exists():
                return Response(
                    {"error": "Product already in wishlist"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            wishlist.products.add(product)
            return Response(
                WishlistSerializer(wishlist, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )

        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
)

class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)