from django.urls import path, include
from rest_framework import routers
from .views import VendorViewSet, VehicleViewSet, LocationViewSet, EmployeeViewSet

router = routers.DefaultRouter()

# Register viewsets
router.register(r'vendors', VendorViewSet, basename='vendor')
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'locations', LocationViewSet, basename='location')
router.register(r'employees', EmployeeViewSet, basename='employee')



urlpatterns = [
    path('', include(router.urls)),
]
