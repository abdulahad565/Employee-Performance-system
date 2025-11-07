from django import forms
from .models import Employee, PerformanceReview

class EmployeeForm(forms.ModelForm):
    class Meta:
        model = Employee
        fields = ['first_name', 'last_name', 'email', 'department', 'date_of_joining']

class PerformanceReviewForm(forms.ModelForm):
    class Meta:
        model = PerformanceReview
        fields = ['employee', 'review_period', 'rating', 'feedback', 'review_date']
