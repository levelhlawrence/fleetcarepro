from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    VendorViewSet, VehicleViewSet, LocationViewSet, EmployeeViewSet,
    CustomTokenObtainPairView, RegisterView, LogoutView, 
    UserProfileView, ChangePasswordView, user_info
)

router = routers.DefaultRouter()

# Register viewsets
router.register(r'vendors', VendorViewSet, basename='vendor')
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'locations', LocationViewSet, basename='location')
router.register(r'employees', EmployeeViewSet, basename='employee')



urlpatterns = [
    # API Routes
    path('', include(router.urls)),
    
    # Authentication Routes
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/profile/', UserProfileView.as_view(), name='user_profile'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('auth/user/', user_info, name='user_info'),
]
