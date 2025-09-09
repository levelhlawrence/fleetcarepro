from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import logout

from .models import Vendor, Vehicle, Location, Employee, WorkOrder, Task
from django.db.models import Q
from .serializers import (
    VendorSerializer, VehicleSerializer, LocationSerializer, EmployeeSerializer,
    WorkOrderSerializer, CustomTokenObtainPairSerializer, UserRegistrationSerializer, 
    UserProfileSerializer, ChangePasswordSerializer, TaskSerializer
)

# VENDOR VIEWS
class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated]


# VEHICLES VIEWS
class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Vehicle.objects.all()
        
        # Get search parameters
        search_query = self.request.query_params.get('search', None)
        vehicle_no = self.request.query_params.get('vehicle_no', None)
        year = self.request.query_params.get('year', None)
        location = self.request.query_params.get('location', None)
        
        # Apply filters based on search parameters
        if search_query:
            # General search across multiple fields
            queryset = queryset.filter(
                Q(bus_no__icontains=search_query) |
                Q(body_year__icontains=search_query) |
                Q(assigned_shop__icontains=search_query) |
                Q(veh_make__icontains=search_query) |
                Q(body_make__icontains=search_query) |
                Q(body_model__icontains=search_query)
            )
        
        # Specific field filters
        if vehicle_no:
            queryset = queryset.filter(bus_no__icontains=vehicle_no)
        
        if year:
            queryset = queryset.filter(
                Q(body_year__icontains=year) |
                Q(chassis_year__icontains=year)
            )
        
        if location:
            queryset = queryset.filter(assigned_shop__icontains=location)
        
        return queryset.order_by('bus_no')


# LOCATION VIEWS
class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticated]

# EMPLOYEE VIEWS (Admin only for full CRUD)
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Regular users can only see their own profile
        # Staff/superusers can see all employees
        if self.request.user.is_staff:
            return Employee.objects.all()
        return Employee.objects.filter(id=self.request.user.id)

# WORK ORDER VIEWS
class WorkOrderViewSet(viewsets.ModelViewSet):
    queryset = WorkOrder.objects.all()
    serializer_class = WorkOrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = WorkOrder.objects.select_related('vehicle', 'assigned_to', 'created_by', 'vendor')
        
        # Filter by status
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by vehicle
        vehicle = self.request.query_params.get('vehicle', None)
        if vehicle:
            queryset = queryset.filter(vehicle__bus_no__icontains=vehicle)
        
        # Filter by assigned user
        assigned_to = self.request.query_params.get('assigned_to', None)
        if assigned_to:
            queryset = queryset.filter(assigned_to_id=assigned_to)
        
        # Filter by priority
        priority = self.request.query_params.get('priority', None)
        if priority:
            queryset = queryset.filter(priority=priority)
        
        # Search across multiple fields
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(work_order_id__icontains=search) |
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(vehicle__bus_no__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

# AUTHENTICATION VIEWS
class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login view that returns JWT tokens with user info"""
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(APIView):
    """User registration view"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate tokens for the new user
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'User registered successfully',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'department': user.department,
                    'employee_id': user.employee_id,
                },
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    """Logout view that blacklists the refresh token"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({
                'message': 'Successfully logged out'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': 'Invalid token'
            }, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    """User profile view for getting and updating profile"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    def patch(self, request):
        serializer = UserProfileSerializer(
            request.user, 
            data=request.data, 
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    """Change password view"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, 
            context={'request': request}
        )
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({
                'message': 'Password changed successfully'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    """Get current user info"""
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]