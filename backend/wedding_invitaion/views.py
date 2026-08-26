
from django.db.models import Count, Sum
from django.db.models.functions import TruncDate
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView, ListCreateAPIView, RetrieveUpdateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Guest, Venue, SiteSettings, GalleryImage, SiteMusic
from .serializers import (
    GuestSerializer, VenueSerializer, SiteSettingsSerializer, GalleryImageSerializer, SiteMusicSerializer,
)


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


class GalleryImageListCreateView(ListCreateAPIView):
    """Public GET (ordered list) for the wedding site; POST (upload) restricted to authenticated admins."""

    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return super().get_permissions()


class GalleryImageDetailView(RetrieveUpdateDestroyAPIView):
    """Protected: edit (label/aspect/order) or delete a single gallery image."""

    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
    parser_classes = [MultiPartParser, FormParser]


class SiteMusicDetailView(RetrieveUpdateAPIView):
    """Public GET for the wedding site; PUT/PATCH (file upload) and DELETE (clear file) restricted to authenticated admins."""

    serializer_class = SiteMusicSerializer
    parser_classes = [MultiPartParser, FormParser]
    http_method_names = ["get", "put", "patch", "delete"]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return super().get_permissions()

    def get_object(self):
        return SiteMusic.load()

    def delete(self, request, *args, **kwargs):
        music = self.get_object()
        if music.audio_file:
            music.audio_file.delete(save=False)
        music.audio_file = None
        music.save()
        return Response(self.get_serializer(music).data)