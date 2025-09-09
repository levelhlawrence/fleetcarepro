from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

# All API models go here.

# Vendor Model 
class Vendor (models.Model):
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    zipcode = models.CharField(max_length=20, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    number = models.CharField(max_length=15, null=True, blank=True)
    vendor_id = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 
    class Meta:
        managed = True
        db_table = 'vehicles_vendor'

    def __str__(self):
        return self.name

#Employee Model
class EmployeeManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        extra_fields.setdefault("username", email.split("@")[0])  # fallback username
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class Employee(AbstractUser):
    email = models.EmailField(unique=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    zipcode = models.CharField(max_length=20, null=True, blank=True)
    position = models.CharField(max_length=20, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    number = models.CharField(max_length=15, null=True, blank=True)
    department = models.CharField(max_length=100, null=True, blank=True)
    employee_id = models.CharField(max_length=50, blank=True, null=True, unique=True)
    notes = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["employee_id", "first_name", "last_name"]

    objects = EmployeeManager()

    class Meta:
        
        db_table = "employees"

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


# Vehicle Model

class Vehicle(models.Model):
    bus_no = models.CharField(max_length=50, unique=True, primary_key=True)
    veh_make = models.CharField(max_length=100, blank=True, null=True)
    body_model = models.CharField(max_length=100, blank=True, null=True)
    fuel_type = models.CharField(max_length=50, blank=True, null=True)
    vin_number = models.CharField(max_length=100, unique=True)
    tag_no = models.CharField(max_length=50, blank=True, null=True)
    body_year = models.CharField(blank=True, null=True)
    next_ps_date = models.DateField(blank=True, null=True)
    inservice_date = models.DateField(blank=True, null=True)
    vehicle_class = models.CharField(max_length=50, blank=True, null=True)
    veh_model = models.CharField(max_length=100, blank=True, null=True)
    chassis_year = models.CharField(blank=True, null=True)
    orig_cost = models.CharField( blank=True, null=True)
    cap = models.CharField(blank=True, null=True)  # capacity
    body_make = models.CharField(max_length=100, blank=True, null=True)
    body_no = models.CharField(max_length=50, blank=True, null=True)
    trans_serial_no = models.CharField(max_length=100, blank=True, null=True)
    trans_manuf = models.CharField(max_length=100, blank=True, null=True)
    trans_model = models.CharField(max_length=100, blank=True, null=True)
    eng_type = models.CharField(max_length=100, blank=True, null=True)
    eng_manuf = models.CharField(max_length=100, blank=True, null=True)
    eng_model = models.CharField(max_length=100, blank=True, null=True)
    eng_serial_no = models.CharField(max_length=100, blank=True, null=True)
    last_in_shop = models.DateField(blank=True, null=True)
    last_ps_date = models.DateField(blank=True, null=True)
    next_oil_change = models.DateField(blank=True, null=True)
    fuel_gal = models.FloatField(blank=True, null=True)
    last_fuel_mileage = models.CharField(blank=True, null=True)
    ytd_fuel = models.FloatField(blank=True, null=True)
    current_mileage = models.CharField(blank=True, null=True)
    sch_begin_mileage = models.CharField(blank=True, null=True)
    labor_cost = models.CharField(blank=True, null=True)
    parts_cost = models.CharField(blank=True, null=True)
    other_cost = models.CharField(blank=True, null=True)
    total_opr_cost = models.CharField(blank=True, null=True)
    chassis_no = models.CharField(max_length=100, blank=True, null=True)
    last_time_in = models.DateTimeField(blank=True, null=True)
    last_time_out = models.DateTimeField(blank=True, null=True)
    last_oil_change = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)
    gross_weight = models.CharField(blank=True, null=True)
    gvw_front = models.CharField(blank=True, null=True)
    tire_size = models.CharField(max_length=50, blank=True, null=True)
    gvw_rear = models.CharField(blank=True, null=True)
    wheel_base = models.CharField(blank=True, null=True)
    wheel_chair = models.BooleanField(default=False)
    assigned_shop = models.CharField(max_length=100, blank=True, null=True)
    insp_group = models.CharField(max_length=100, blank=True, null=True)
    bus_driver = models.CharField(max_length=100, blank=True, null=True)
    status_date = models.DateField(blank=True, null=True)
    trade_code = models.CharField(max_length=50, blank=True, null=True)
    last_pm_mileage = models.CharField(blank=True, null=True)
    next_pm_mileage = models.CharField(blank=True, null=True)
    last_pm_date = models.DateField(blank=True, null=True)
    next_pm_date = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vehicles'

    def __str__(self):
        return f"{self.bus_no} ({self.veh_make} {self.veh_model})"


# Location Model
class Location(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    zipcode = models.CharField(max_length=20, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    fax = models.CharField(max_length=15, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'shop_locations'

    def __str__(self):
        return self.name


# Work Order Model
class WorkOrder(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('down', 'Vehicle Down'),
        ('outsourced', 'Outsourced'),
        ('in_service', 'Back In Service'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    REPAIR_TYPE_CHOICES = [
        ('repair', 'Repair'),
        ('inspection', 'Inspection'),
        ('summer_inspection', 'Summer Inspection'),
        ('state_inspection', 'State Inspection'),
        ('trip_inspection', 'Trip Inspection'),
    ]
    
    work_order_id = models.CharField(max_length=50, unique=True, blank=True)
    
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='work_orders')
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    repair_type = models.CharField(max_length=30, choices=REPAIR_TYPE_CHOICES, default='repair')
    # Personnel
    assigned_to = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_work_orders')
    created_by = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='created_work_orders')
    
    # Dates and tracking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Cost tracking
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    actual_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Work details
    mileage_at_work = models.CharField(max_length=20, blank=True, null=True)
    parts_needed = models.TextField(blank=True, null=True)
    work_performed = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    
    # External service
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True, related_name='work_orders')
    external_work_order_no = models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        managed = True
        db_table = 'work_orders'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.work_order_id} - {self.vehicle.bus_no} ({self.get_status_display()})"
    
    def save(self, *args, **kwargs):
        if not self.work_order_id:
            # Auto-generate work order ID
            from datetime import datetime
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            self.work_order_id = f"WO-{timestamp}"

class Task(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name='tasks')
    assigned_to = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    outsourced = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    parts_required = models.TextField(blank=True, null=True)
    labor_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    parts_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    labor_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    other_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    total_cost = models.DecimalField
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 
    due_date = models.DateField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    class Meta:
        managed = True
        db_table = 'work_order_tasks'
        ordering = ['-created_at']
    def __str__(self):
        return f"{self.name} ({'Completed' if self.completed else 'Pending'})"  
    
