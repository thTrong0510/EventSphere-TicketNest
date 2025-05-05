from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from . import views

routers = routers.DefaultRouter()
routers.register('events', views.EventViewSet, basename='events')
routers.register('users', views.UserViewSet, basename='users')

urlpatterns = [
    path('',include(routers.urls))
]