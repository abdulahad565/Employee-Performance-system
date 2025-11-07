# employees/management/commands/populate_sample_data.py

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, timedelta
from employees.models import Employee, PerformanceReview
import random

class Command(BaseCommand):
    help = 'Populate database with sample employee and performance review data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

        # Sample data
        departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance']
        
        sample_employees = [
            {'first_name': 'John', 'last_name': 'Doe', 'email': 'john.doe@company.com', 'department': 'Engineering'},
            {'first_name': 'Jane', 'last_name': 'Smith', 'email': 'jane.smith@company.com', 'department': 'Marketing'},
            {'first_name': 'Mike', 'last_name': 'Johnson', 'email': 'mike.johnson@company.com', 'department': 'Sales'},
            {'first_name': 'Sarah', 'last_name': 'Williams', 'email': 'sarah.williams@company.com', 'department': 'HR'},
            {'first_name': 'David', 'last_name': 'Brown', 'email': 'david.brown@company.com', 'department': 'Engineering'},
            {'first_name': 'Lisa', 'last_name': 'Davis', 'email': 'lisa.davis@company.com', 'department': 'Finance'},
            {'first_name': 'Tom', 'last_name': 'Wilson', 'email': 'tom.wilson@company.com', 'department': 'Engineering'},
            {'first_name': 'Amy', 'last_name': 'Taylor', 'email': 'amy.taylor@company.com', 'department': 'Marketing'},
        ]

        # Create employees
        employees = []
        for emp_data in sample_employees:
            # Random join date within last 2 years
            join_date = date.today() - timedelta(days=random.randint(30, 730))
            
            employee, created = Employee.objects.get_or_create(
                email=emp_data['email'],
                defaults={
                    'first_name': emp_data['first_name'],
                    'last_name': emp_data['last_name'],
                    'department': emp_data['department'],
                    'date_of_joining': join_date
                }
            )
            employees.append(employee)
            
            if created:
                self.stdout.write(f'Created employee: {employee.full_name}')

        # Create performance reviews
        review_periods = ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024']
        
        feedback_samples = [
            "Excellent performance throughout the quarter. Consistently delivers high-quality work.",
            "Good technical skills and teamwork. Could improve on meeting deadlines.",
            "Shows great leadership potential. Excellent communication skills.",
            "Solid performance with room for improvement in project management.",
            "Outstanding contributor to team success. Very reliable and efficient.",
            "Good analytical skills. Needs to work on presentation skills.",
            "Excellent problem-solving abilities. Great mentor to junior team members.",
            "Consistent performer with strong attention to detail.",
        ]

        for employee in employees:
            # Create 2-4 random reviews per employee
            num_reviews = random.randint(2, 4)
            selected_periods = random.sample(review_periods, num_reviews)
            
            for period in selected_periods:
                # Random review date within the period
                base_date = date.today() - timedelta(days=random.randint(30, 400))
                
                review, created = PerformanceReview.objects.get_or_create(
                    employee=employee,
                    review_period=period,
                    defaults={
                        'rating': random.randint(3, 5),  # Ratings between 3-5
                        'feedback': random.choice(feedback_samples),
                        'review_date': base_date
                    }
                )
                
                if created:
                    self.stdout.write(f'Created review: {employee.full_name} - {period}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created sample data:\n'
                f'- {Employee.objects.count()} employees\n'
                f'- {PerformanceReview.objects.count()} performance reviews'
            )
        )