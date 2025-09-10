from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import Vendor, Vehicle, Location, Employee, WorkOrder, Task, Department

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'       

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    class Meta:
        model = Employee
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }

class WorkOrderSerializer(serializers.ModelSerializer):
    vehicle_info = serializers.SerializerMethodField()
    assigned_to_name = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()
    vendor_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    
    class Meta:
        model = WorkOrder
        fields = '__all__'
        read_only_fields = ('work_order_id', 'created_at', 'updated_at')
    
    def get_vehicle_info(self, obj):
        return {
            'bus_no': obj.vehicle.bus_no,
            'make': obj.vehicle.veh_make or obj.vehicle.body_make,
            'model': obj.vehicle.veh_model or obj.vehicle.body_model,
            'year': obj.vehicle.body_year or obj.vehicle.chassis_year
        }
    
    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return f"{obj.assigned_to.first_name} {obj.assigned_to.last_name}"
        return None
    
    def get_created_by_name(self, obj):
        return f"{obj.created_by.first_name} {obj.created_by.last_name}"
    
    def get_vendor_name(self, obj):
        return obj.vendor.name if obj.vendor else None

# Authentication Serializers
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT token serializer that returns user info with tokens"""
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add user data to the response
        data['user'] = UserProfileSerializer(self.user).data
        
        return data

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = Employee
        fields = (
            'email', 'password', 'password_confirm', 'first_name', 'last_name',
            'employee_id', 'department', 'city', 'state', 'zipcode', 'address',
            'number', 'date_of_birth', 'notes'
        )
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'department': {'required': True},
            'employee_id': {'required': True},
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Password fields didn't match.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = Employee.objects.create_user(
            password=password,
            **validated_data
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile (read/update)"""
    class Meta:
        model = Employee
        fields = (
            'id', 'email', 'first_name', 'last_name', 'employee_id', 'department',
            'city', 'state', 'zipcode', 'address', 'number', 'date_of_birth',
            'notes', 'date_joined', 'is_active', 'position', 'updated_at', 'last_login'
        )
        read_only_fields = ('id', 'email', 'employee_id', 'date_joined')
        

class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password"""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New password fields didn't match.")
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ('task_id', 'created_at', 'updated_at')

