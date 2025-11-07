# # employees/urls.py

# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import EmployeeViewSet, PerformanceReviewViewSet
# from .auth_views import login_view, logout_view, check_auth, get_csrf_token, signup_view

# router = DefaultRouter()
# router.register(r'employees', EmployeeViewSet)
# router.register(r'reviews', PerformanceReviewViewSet)

# urlpatterns = [
#     path('api/', include(router.urls)),
#     # Authentication endpoints
#     path('api/auth/signup/', signup_view, name='signup'),
#     path('api/auth/login/', login_view, name='login'),
#     path('api/auth/logout/', logout_view, name='logout'),
#     path('api/auth/check/', check_auth, name='check_auth'),
    
#     path('api/auth/csrf-token/', get_csrf_token, name='get_csrf_token'),
# ]

# employees/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, PerformanceReviewViewSet
from .auth_views import login_view, logout_view, check_auth, get_csrf_token, signup_view
from . import views

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)
router.register(r'reviews', PerformanceReviewViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/login/', login_view, name='login'),
    path('api/auth/signup/', signup_view, name='signup'),
    path('api/auth/logout/', logout_view, name='logout'),
    path('api/auth/user/', check_auth, name='check_auth'),  # This line is critical
    path('api/auth/csrf-token/', get_csrf_token, name='csrf_token'),
    
    
    
    path('', views.employee_list, name='employee_list'),
    path('employee/add/', views.employee_create, name='employee_create'),
    path('employee/<int:pk>/edit/', views.employee_update, name='employee_update'),
    path('employee/<int:pk>/delete/', views.employee_delete, name='employee_delete'),

    # Review URLs
    path('reviews/', views.review_list, name='review_list'),
    path('reviews/add/', views.review_create, name='review_create'),
    path('reviews/<int:pk>/edit/', views.review_update, name='review_update'),
    path('reviews/<int:pk>/delete/', views.review_delete, name='review_delete'),
]