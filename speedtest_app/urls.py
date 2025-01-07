from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),  # Home page
    path('test-speed/', views.test_speed, name='test_speed'),  # Speed test endpoint
]
