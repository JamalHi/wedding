from django.urls import path
from .views import (
    GuestCreateView, GuestListView, GuestResetView, StatsView,
    VenueDetailView, SiteSettingsDetailView,
)

urlpatterns = [
    path("guest/", GuestCreateView.as_view()),
    path("guests/", GuestListView.as_view()),
    path("guests/reset/", GuestResetView.as_view()),
    path("stats/", StatsView.as_view()),
    path("venue/", VenueDetailView.as_view()),
    path("settings/", SiteSettingsDetailView.as_view()),
]