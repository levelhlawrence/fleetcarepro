from django.urls import path, include
from rest_framework import routers
from .views import VendorViewSet, VehicleViewSet, LocationViewSet, EmployeeViewSet

router = routers.DefaultRouter()

# Register viewsets
router.register(r'vendors', VendorViewSet)
router.register(r'vehicles', VehicleViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'employees', EmployeeViewSet)



urlpatterns = [
    path('', include(router.urls)), 
]
