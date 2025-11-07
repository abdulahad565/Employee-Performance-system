# employees/serializers.py

from rest_framework import serializers
from .models import Employee, PerformanceReview

class PerformanceReviewSerializer(serializers.ModelSerializer):
    rating_display = serializers.CharField(source='get_rating_display', read_only=True)
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    
    class Meta:
        model = PerformanceReview
        fields = [
            'id', 'review_period', 'rating', 'rating_display', 
            'feedback', 'review_date', 'employee', 'employee_name'
        ]
#nestes Serializer for detailed employee views
class EmployeeSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    performance_reviews = PerformanceReviewSerializer(many=True, read_only=True)
    reviews_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    
    class Meta:
        model = Employee
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 
            'email', 'department', 'date_of_joining',
            'performance_reviews', 'reviews_count', 'average_rating'
        ]
    
    def get_reviews_count(self, obj):
        return obj.performance_reviews.count()
    
    def get_average_rating(self, obj):
        reviews = obj.performance_reviews.all()
        if reviews:
            return round(sum(review.rating for review in reviews) / len(reviews), 2)
        return None

# Simple serializer for list views (without nested reviews)
class EmployeeListSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    reviews_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    latest_review_period = serializers.SerializerMethodField()
    
    class Meta:
        model = Employee
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 
            'email', 'department', 'date_of_joining',
            'reviews_count', 'average_rating', 'latest_review_period'
        ]
    
    def get_reviews_count(self, obj):
        return obj.performance_reviews.count()
    
    def get_average_rating(self, obj):
        reviews = obj.performance_reviews.all()
        if reviews:
            return round(sum(review.rating for review in reviews) / len(reviews), 2)
        return None
    
    def get_latest_review_period(self, obj):
        latest_review = obj.performance_reviews.first()
        return latest_review.review_period if latest_review else None