from os import name

from django.db import models

# Create your models here.

class Guest(models.Model):
    ATTENDANCE_CHOICES = [("yes", "Yes"), ("no", "No"), ("maybe", "Maybe")]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    attendance = models.CharField(max_length=10, choices=ATTENDANCE_CHOICES)
    guests = models.PositiveSmallIntegerField(default=1)
    dietary = models.CharField(max_length=100, blank=True)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
