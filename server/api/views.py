from rest_framework import viewsets
from .models import Vendor, Vehicle, Location, Employee
from .serializers import VendorSerializer, VehicleSerializer, LocationSerializer, EmployeeSerializer  

# VENDOR VIEWS
class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer


# VEHICLES VIEWS
class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer


# LOCATION VIEWS
class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

# EMPLOYEE VIEWS
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
