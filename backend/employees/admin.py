from django.contrib import admin

# Register your models here.
# employees/admin.py

from django.contrib import admin
from .models import Employee, PerformanceReview

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'department', 'date_of_joining']
    list_filter = ['department', 'date_of_joining']
    search_fields = ['first_name', 'last_name', 'email']
    ordering = ['last_name', 'first_name']

@admin.register(PerformanceReview)
class PerformanceReviewAdmin(admin.ModelAdmin):
    list_display = ['employee', 'review_period', 'rating', 'review_date']
    list_filter = ['rating', 'review_period', 'review_date']
    search_fields = ['employee__first_name', 'employee__last_name', 'review_period']
    ordering = ['-review_date']