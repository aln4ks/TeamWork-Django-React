"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path("", views.home, name="home")
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path("", Home.as_view(), name="home")
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path("blog/", include("blog.urls"))
"""
from django.urls import path
from django.contrib import admin

from .views import (
    RegisterView, LoginView, LogoutView, TaskView, ProjectView, UserProfileView, EventSchedulerView, GetEmployeesView,
    GetTaskChoicesView, GetPostNamesView, CommentView, ExportToXLSXView, CompletedTasksStatisticGraphic,
    CompletedTasksByDayOfWeekGraphic, DocsForProjectView, DeletedTaskView
)

urlpatterns = [
    #main
    path("admin/", admin.site.urls),
    path("get-employees/", GetEmployeesView.as_view(), name="get-employees"),
    path("get-employees/<str:project_id>/", GetEmployeesView.as_view(), name="get-project-employees"),
    path("get-post-names/", GetPostNamesView.as_view(), name="get-post-names"),
    path("get-task-choices/", GetTaskChoicesView.as_view(), name="get-task-choices"),

    #user
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("user-profile/", UserProfileView.as_view(), name="user-profile"),
    path('user-profile/update/', UserProfileView.as_view(), name='user-profile-update'),

    #project
    path("project/create", ProjectView.as_view(), name="create-project"),
    path("project/<str:project_id>/delete/", ProjectView.as_view(), name="delete-project"),
    path("projects/", ProjectView.as_view(), name="view-projects"),
    path("project/<str:project_id>/", ProjectView.as_view(), name="view-board"),
    path("project/<str:project_id>/export/", ExportToXLSXView.as_view(), name="project-export"),

    #task
    path("project/<str:project_id>/task/create/", TaskView.as_view(), name="task-create"),
    path("task/<str:task_id>/", TaskView.as_view(), name="view-task"),
    path("task/<str:task_id>/delete/", TaskView.as_view(), name="task-delete"),
    path("task/<str:task_id>/update/", TaskView.as_view(), name="task-update"),
    path("user/tasks/", TaskView.as_view(), name="user-tasks"),
    path("<str:project_id>/tasks/deleted/", DeletedTaskView.as_view(), name="view-deleted-tasks"),
    path("<str:task_id>/task/restore/", DeletedTaskView.as_view(), name="restore-deleted-task"),
    path("task/<str:task_id>/hard-delete/", DeletedTaskView.as_view(), name="task-hard-delete"),

    #event-scheduler
    path("event-scheduler/", EventSchedulerView.as_view(), name="event-scheduler"),
    path("event-scheduler/create", EventSchedulerView.as_view(), name="event-scheduler-create"),
    path("event-scheduler/<str:event_id>/delete/", EventSchedulerView.as_view(), name="event-scheduler-delete"),
    path("event-scheduler/<str:event_id>/update/", EventSchedulerView.as_view(), name="event-scheduler-update"),

    #comment
    path("task/<str:task_id>/comments", CommentView.as_view(), name="task-comments"),
    path("task/<str:task_id>/comment/create", CommentView.as_view(), name="comment-create"),
    path("comment/<str:comm_id>/delete", CommentView.as_view(), name="comment-delete"),
    path("comment/<str:comm_id>/update", CommentView.as_view(), name="comment-update"),

    #graphics
    path(
        "project/<str:project_id>/completed-tasks-graphic/",
        CompletedTasksStatisticGraphic.as_view(),
        name="project-completed-tasks-graphic"
    ),
    path(
        "project/<str:project_id>/completed-tasks-by-day-of-week-graphic/",
        CompletedTasksByDayOfWeekGraphic.as_view(),
        name="project-completed-tasks-by-day-of-week-graphic"
    ),

    #docs
    path(
        "project/<str:project_id>/documents/",
        DocsForProjectView.as_view(),
        name="project-documents"
    ),
    path(
        "project/<str:project_id>/documents/delete",
        DocsForProjectView.as_view(),
        name="project-documents-delete"
    ),
    path(
        "project/<str:project_id>/documents/load",
        DocsForProjectView.as_view(),
        name="project-documents-delete"
    ),
]
