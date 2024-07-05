from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from teamwork.views.auxiliary import auth_required, get_user
from teamwork.serializers import TaskSerializer
from teamwork.models import Task, STATUS_CHOICES


class TaskView(APIView):
    serializer_class = TaskSerializer

    @staticmethod
    def _get_task(task_id):
        return Task.objects.get(id=task_id)

    @auth_required
    def post(self, request, project_id):
        """
        Создание задачи
        """
        user = get_user(request)
        req_data = request.data.copy()
        req_data["creator"] = user.id
        req_data["project"] = project_id
        req_data["status"] = STATUS_CHOICES[0][0]
        serializer = self.serializer_class(data=req_data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @auth_required
    def get(self, request, task_id=None):
        """
        Просмотр задач пользователя
        """
        user = get_user(request)
        if task_id:
            try:
                task = self._get_task(task_id)
            except Task.DoesNotExist:
                return Response(status=404, data={"message": f"Задача с id {task_id} не найдена!"})
            serializer = TaskSerializer(task)
        else:
            tasks = Task.get_user_tasks(user)
            serializer = self.serializer_class(tasks, many=True)
        return Response(serializer.data)

    @auth_required
    def patch(self, request, task_id=None):
        """
        Редактирование задачи
        """
        if task_id:
            task = self._get_task(task_id)
            serializer = self.serializer_class(task, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @auth_required
    def delete(self, request, task_id=None):
        """
        Удаление задачи
        """
        response = Response()
        if task_id:
            task = self._get_task(task_id)
            task.delete()
            response.data = {
                "success_message": "Задача успешно удалёна!",
            }
            return response


class DeletedTaskView(APIView):
    serializer_class = TaskSerializer

    @staticmethod
    def _get_task(task_id):
        return Task.objects.get(id=task_id)

    @auth_required
    def get(self, request, project_id):
        """
        Просмотр удалённых задач проекта
        """
        completed_tasks = Task.deleted_objects.filter(project_id=project_id)
        serializer = TaskSerializer(completed_tasks, many=True)
        return Response(serializer.data)

    @auth_required
    def patch(self, request, task_id):
        """
        Восстановление удалённой задачи проекта
        """
        task = Task.deleted_objects.get(id=task_id)
        task.restore()
        task.status = STATUS_CHOICES[1][1]
        task.save()
        return Response(data={"Успешное восстановление": "Задача успено восстановлена!"})

    @auth_required
    def delete(self, request, task_id):
        """
        Полное удаление задачи проекта
        """
        task = Task.deleted_objects.get(id=task_id)
        task.hard_delete()
        return Response(data={"Успешное удаление": "Задача удалена навсегда!"})
