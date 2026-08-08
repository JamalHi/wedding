
from django.db.models import Count, Sum
from django.db.models.functions import TruncDate
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Guest, Venue, SiteSettings
from .serializers import GuestSerializer, VenueSerializer, SiteSettingsSerializer


class GuestCreateView(CreateAPIView):
    serializer_class = GuestSerializer
    permission_classes = [AllowAny]


class GuestListView(ListAPIView):
    """Protected: full guest list for the admin dashboard table, newest first."""
    queryset = Guest.objects.all().order_by("-created_at")
    serializer_class = GuestSerializer


class GuestResetView(APIView):
    """Protected: permanently deletes all guest responses."""

    def post(self, request):
        deleted_count, _ = Guest.objects.all().delete()
        return Response({"deleted": deleted_count}, status=status.HTTP_200_OK)


class StatsView(APIView):
    """Protected: aggregated numbers for the admin dashboard."""

    def get(self, request):
        qs = Guest.objects.all()
        counts = {
            "yes": qs.filter(attendance="yes").count(),
            "no": qs.filter(attendance="no").count(),
            "maybe": qs.filter(attendance="maybe").count(),
        }
        total_attendees = qs.filter(attendance="yes").aggregate(total=Sum("guests"))["total"] or 0

        dietary_requirements = list(
            qs.exclude(dietary="").values("name", "dietary")
        )

        timeline_qs = (
            qs.annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(count=Count("id"))
            .order_by("day")
        )
        timeline = [{"date": row["day"].isoformat(), "count": row["count"]} for row in timeline_qs]

        return Response({
            "total_responses": qs.count(),
            "counts": counts,
            "total_attendees": total_attendees,
            "dietary_requirements": dietary_requirements,
            "timeline": timeline,
        })


class VenueDetailView(RetrieveUpdateAPIView):
    """Public GET for the wedding site; PUT/PATCH restricted to authenticated admins."""

    serializer_class = VenueSerializer
    http_method_names = ["get", "put", "patch"]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return super().get_permissions()

    def get_object(self):
        return Venue.load()


class SiteSettingsDetailView(RetrieveUpdateAPIView):
    """Public GET for the wedding site; PUT/PATCH restricted to authenticated admins."""

    serializer_class = SiteSettingsSerializer
    http_method_names = ["get", "put", "patch"]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return super().get_permissions()

    def get_object(self):
        return SiteSettings.load()