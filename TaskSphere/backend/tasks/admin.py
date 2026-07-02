from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'status', 'owner', 'created_at', 'updated_at')
    list_filter = ('status', 'owner', 'created_at')
    search_fields = ('title', 'description')
