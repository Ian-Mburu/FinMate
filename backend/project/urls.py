from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from app.views import (
    CustomTokenObtainPairView, ProductsView, userProfile, search_products,
    SignUpView, current_user, updateUserprofileView, CartViewSet,
    WishlistViewSet, OrderViewSet, TokenRefreshView
)
from rest_framework_simplejwt.views import TokenVerifyView

router = routers.DefaultRouter()
router.register(r'products', ProductsView, basename='productview')
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'orders', OrderViewSet, basename='orders')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/user/<str:username>/', userProfile, name='user-profile'),
    path('api/products/search/', search_products, name='search-products'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/signup/', SignUpView.as_view(), name='signup'),
    path('api/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('api/current-user/', current_user, name='current-user'),
    path('api/user/update/', updateUserprofileView.as_view(), name='update-profile'),
    path('api/checkout/', CartViewSet.as_view({'post': 'checkout'}), name='checkout'),
    path('api/cart/add_item/', CartViewSet.as_view({'post': 'add_item'}), name='cart-add-item'),
    path('api/wishlist/', WishlistViewSet.as_view({'get': 'list'}), name='wishlist-list'),
    path('api/wishlist/add_product/', WishlistViewSet.as_view({'post': 'add_product'}), name='wishlist-add-product'),
    path('api/wishlist/remove_product/<int:pk>/', WishlistViewSet.as_view({'delete': 'remove_product'}), name='wishlist-remove-product'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
