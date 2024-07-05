from django.http import JsonResponse
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

from rest_framework.views import APIView
from teamwork.mixins.Mixins import GraphicsMixin
from teamwork.views.auxiliary import auth_required
from teamwork.models import Project, Task, STATUS_CHOICES


class CompletedTasksStatisticGraphic(APIView, GraphicsMixin):
    @auth_required
    def get(self, request, project_id):
        project = self._get_project(project_id)
        active_tasks = Task.objects.filter(project=project).exclude(
            status=STATUS_CHOICES[-1][0]
        ).select_related("creator", "executor")
        completed_tasks = self._get_completed_tasks(project_id)
        tasks_status = {
            "В работе": active_tasks.count(),
            "Выполненные": completed_tasks.count()
        }
        labels = tasks_status.keys()
        sizes = tasks_status.values()

        fig, ax = plt.subplots()
        ax.pie(sizes, labels=labels, autopct="%1.1f%%", startangle=90)
        ax.axis("equal")

        image_base64 = self.do_image_base64()

        return JsonResponse({"image": image_base64})


class CompletedTasksByDayOfWeekGraphic(APIView, GraphicsMixin):
    @auth_required
    def get(self, request, project_id):
        completed_tasks = self._get_completed_tasks(project_id)

        days_of_week = {0: "ПН", 1: "ВТ", 2: "СР", 3: "ЧТ", 4: "ПТ", 5: "СБ", 6: "ВС"}

        tasks_count_by_day = {day: int(0) for day in days_of_week.values()}

        for task in completed_tasks:
            day_of_week = days_of_week[task.completed_date.weekday()]
            tasks_count_by_day[day_of_week] += 1

        labels = tasks_count_by_day.keys()
        values = tasks_count_by_day.values()

        fig, ax = plt.subplots()
        ax.bar(labels, values)
        ax.set_xlabel("День недели")
        ax.set_ylabel("Количество выполненных задач")
        ax.set_title("Количество выполненных задач по дням недели")

        image_base64 = self.do_image_base64()

        return JsonResponse({"image": image_base64})
