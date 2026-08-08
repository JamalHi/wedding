from django.contrib import admin

from wedding_invitaion.models import Guest

# Register your models here.

@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    list_display = ("name", "attendance", "guests", "created_at")
    list_filter = ("attendance",)
    search_fields = ("name", "email")