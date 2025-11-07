

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Count, Avg
from .models import Employee, PerformanceReview
from .serializers import EmployeeSerializer, PerformanceReviewSerializer


from django.shortcuts import render, redirect, get_object_or_404
from .models import Employee, PerformanceReview
from .forms import EmployeeForm, PerformanceReviewForm

# ==============================
# Employee CRUD Views
# ==============================

def employee_list(request):
    employees = Employee.objects.all()
    return render(request, 'employees/employee_list.html', {'employees': employees})

def employee_create(request):
    if request.method == 'POST':
        form = EmployeeForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('employee_list')
    else:
        form = EmployeeForm()
    return render(request, 'employees/employee_form.html', {'form': form})

def employee_update(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    if request.method == 'POST':
        form = EmployeeForm(request.POST, instance=employee)
        if form.is_valid():
            form.save()
            return redirect('employee_list')
    else:
        form = EmployeeForm(instance=employee)
    return render(request, 'employees/employee_form.html', {'form': form})

def employee_delete(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    if request.method == 'POST':
        employee.delete()
        return redirect('employee_list')
    return render(request, 'employees/employee_confirm_delete.html', {'employee': employee})


# ==============================
# Performance Review CRUD Views
# ==============================

def review_list(request):
    reviews = PerformanceReview.objects.select_related('employee').all()
    return render(request, 'employees/review_list.html', {'reviews': reviews})

def review_create(request):
    if request.method == 'POST':
        form = PerformanceReviewForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('review_list')
    else:
        form = PerformanceReviewForm()
    return render(request, 'employees/review_form.html', {'form': form})

def review_update(request, pk):
    review = get_object_or_404(PerformanceReview, pk=pk)
    if request.method == 'POST':
        form = PerformanceReviewForm(request.POST, instance=review)
        if form.is_valid():
            form.save()
            return redirect('review_list')
    else:
        form = PerformanceReviewForm(instance=review)
    return render(request, 'employees/review_form.html', {'form': form})

def review_delete(request, pk):
    review = get_object_or_404(PerformanceReview, pk=pk)
    if request.method == 'POST':
        review.delete()
        return redirect('review_list')
    return render(request, 'employees/review_confirm_delete.html', {'review': review})



class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]  # Change to IsAuthenticated in production
    
    @action(detail=False, methods=['get'])
    def departments(self, request):
        """Get list of departments"""
        try:
            departments = Employee.objects.exclude(
                department__isnull=True
            ).exclude(
                department=''
            ).values_list('department', flat=True).distinct()
            return Response(list(departments))
        except Exception as e:
            print(f"Departments error: {str(e)}")
            return Response([])
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get employee statistics"""
        try:
            total_employees = Employee.objects.count()
            
            # Get department counts, filter out None/empty
            departments = Employee.objects.exclude(
                department__isnull=True
            ).exclude(
                department=''
            ).values('department').annotate(
                count=Count('id')
            ).order_by('-count')
            
          # Calculate average salary safely
        
            
            return Response({
                'total_employees': total_employees,
                'departments': list(departments),
                
            })
        except Exception as e:
            print(f"Statistics error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                'total_employees': 0,
                'departments': [],
                
            })
    
    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        """Get reviews for a specific employee"""
        try:
            employee = self.get_object()
            reviews = PerformanceReview.objects.filter(employee=employee)
            serializer = PerformanceReviewSerializer(reviews, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Employee reviews error: {str(e)}")
            return Response([])

class PerformanceReviewViewSet(viewsets.ModelViewSet):
    queryset = PerformanceReview.objects.all()
    serializer_class = PerformanceReviewSerializer
    permission_classes = [IsAuthenticated]  # Change to IsAuthenticated in production
    
    def get_queryset(self):
        queryset = PerformanceReview.objects.all()
        employee_id = self.request.query_params.get('employee', None)
        if employee_id is not None:
            queryset = queryset.filter(employee_id=employee_id)
        return queryset
    
    @action(detail=False, methods=['get'])
    def periods(self, request):
        """Get distinct review periods"""
        try:
            periods = PerformanceReview.objects.exclude(
                review_period__isnull=True
            ).exclude(
                review_period=''
            ).values_list('review_period', flat=True).distinct()
            return Response(sorted(list(periods)))
        except Exception as e:
            print(f"Review periods error: {str(e)}")
            return Response([])
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get performance review statistics"""
        try:
            total_reviews = PerformanceReview.objects.count()
            
            # Calculate average rating safely
            avg_rating = PerformanceReview.objects.aggregate(
                avg_rating=Avg('rating')
            )['avg_rating']
            
            # Round if not None, otherwise set to 0
            avg_rating = round(float(avg_rating), 2) if avg_rating else 0
            
            # Get rating distribution
            rating_distribution = PerformanceReview.objects.values('rating').annotate(
                count=Count('id')
            ).order_by('rating')
            
            return Response({
                'total_reviews': total_reviews,
                'average_rating': avg_rating,
                'rating_distribution': list(rating_distribution)
            })
        except Exception as e:
            print(f"Review statistics error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                'total_reviews': 0,
                'average_rating': 0,
                'rating_distribution': []
            })