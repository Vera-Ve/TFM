"""
URL configuration for movie_app_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from .views import AuthView, RegisterView, WatchlistView, BlacklistView

from . import views
from .views import get_user
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', AuthView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/watchlist/add_to_watchlist/', views.add_to_watchlist, name='add_to_watchlist'),
    path('api/watchlist/', WatchlistView.as_view(), name='watchlist'),
    path('api/blacklist/add/', views.add_to_blacklist, name='blacklist'),
    path('api/blacklist/', BlacklistView.as_view(), name='blacklist'),
    path('api/user/', get_user, name='get_user'),
     ]
