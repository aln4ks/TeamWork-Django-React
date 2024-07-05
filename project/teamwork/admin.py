from django.contrib import admin
from django.contrib.auth.models import Group

from .models import Employee, Project, Task, Comment, EventScheduler


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_filter = ("is_staff",)
    # fields = ["is_superuser", "first_name", "last_name", "is_staff", "is_active",
    #           "date_joined", "is_deleted", "deleted_at", "phone_number"]


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    pass
    # search_fields = ("name",)


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    pass
    # search_fields = ("name",)
    # list_filter = ("price",)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    pass
    # search_fields = ("name",)
    # list_filter = ("price",)


@admin.register(EventScheduler)
class EventSchedulerAdmin(admin.ModelAdmin):
    pass


admin.site.site_header = "Администрирование TeamWork"
admin.site.site_title = "Панель администрирования"
admin.site.index_title = "Добро пожаловать в администрирование TeamWork"

admin.site.unregister(Group)
