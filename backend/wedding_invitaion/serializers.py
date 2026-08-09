from rest_framework import serializers
from .models import Guest, Venue, SiteSettings, GalleryImage, SiteMusic

class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = "__all__"
        read_only_fields = ("created_at",)


class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = "__all__"
        read_only_fields = ("id", "updated_at")


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = "__all__"
        read_only_fields = ("id", "updated_at")


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = "__all__"
        read_only_fields = ("id", "created_at")


class SiteMusicSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteMusic
        fields = "__all__"
        read_only_fields = ("id", "updated_at")