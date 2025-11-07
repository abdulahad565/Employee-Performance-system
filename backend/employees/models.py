from django.db import models

# Create your models here.
# employees/models.py

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Employee(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=100)
    date_of_joining = models.DateField()
    
    class Meta:
        db_table = 'employees'
        ordering = ['last_name', 'first_name']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

class PerformanceReview(models.Model):
    employee = models.ForeignKey(
        Employee, 
        on_delete=models.CASCADE, 
        related_name='performance_reviews'
    )
    review_period = models.CharField(max_length=20)  # e.g., "Q1 2024"
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating must be between 1 and 5"
    )
    feedback = models.TextField(blank=True, null=True)
    review_date = models.DateField()
    
    class Meta:
        db_table = 'performance_reviews'
        # Ensure unique review period per employee
        unique_together = ('employee', 'review_period')
        ordering = ['-review_date']
    
    def __str__(self):
        return f"{self.employee.full_name} - {self.review_period}"
    
    def get_rating_display(self):
        ratings = {
            1: "Poor",
            2: "Below Average", 
            3: "Average",
            4: "Good",
            5: "Excellent"
        }
        return ratings.get(self.rating, "Unknown")