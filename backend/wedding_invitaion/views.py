
from django.db.models import Count, Sum
from django.db.models.functions import TruncDate
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Guest
from .serializers import GuestSerializer


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