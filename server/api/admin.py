from django.contrib import admin
# Import the models to be registered
from .models import Vendor, Vehicle, Location, Employee

admin.site.site_header = "FleetCarePro Admin"
admin.site.site_title = "FleetCarePro Admin Portal"
admin.site.index_title = "Welcome to FleetCarePro Admin Portal"
admin.site.site_url = "http://localhost:5173/" 

# Register your models here.
admin.site.register(Vendor)
admin.site.register(Vehicle)
admin.site.register(Location)
admin.site.register(Employee)
