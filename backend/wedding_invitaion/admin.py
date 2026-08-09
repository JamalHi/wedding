from django.contrib import admin

from wedding_invitaion.models import Guest, Venue, SiteSettings, GalleryImage, SiteMusic

# Register your models here.

@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    list_display = ("name", "attendance", "guests", "created_at")
    list_filter = ("attendance",)
    search_fields = ("name", "email")


@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = ("hall_name", "address", "updated_at")


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ("groom_name", "bride_name", "wedding_datetime", "updated_at")


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ("label", "aspect", "order", "created_at")
    list_editable = ("order",)


@admin.register(SiteMusic)
class SiteMusicAdmin(admin.ModelAdmin):
    list_display = ("audio_file", "updated_at")