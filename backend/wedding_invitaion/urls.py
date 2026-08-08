from django.urls import path
from .views import GuestCreateView, GuestListView, GuestResetView, StatsView

urlpatterns = [
    path("guest/", GuestCreateView.as_view()),
    path("guests/", GuestListView.as_view()),
    path("guests/reset/", GuestResetView.as_view()),
    path("stats/", StatsView.as_view()),
]