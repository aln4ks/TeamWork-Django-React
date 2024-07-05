from rest_framework.response import Response
from rest_framework.views import APIView

from teamwork.models import Employee, Project, Task
from teamwork.serializers import UserSerializer
from teamwork.views.auxiliary import auth_required


class GetEmployeesView(APIView):
    """
    Получение пользоватиелей
    """
    @auth_required
    def get(self, request, project_id=None):
        employees = Employee.get_queryset()
        if project_id:
            employees = Project.get_employees_of_project(project_id)
        users_serializer = UserSerializer(employees, many=True)
        return Response(users_serializer.data)


class GetPostNamesView(APIView):
    """
    Получение названия должностей
    """
    def get(self, request):
        post_names = Employee.get_post_names()
        response = Response()
        response.data = {
            "post_names": post_names
        }
        return response


class GetTaskChoicesView(APIView):
    """
    Получение списка выбора для задач
    """
    def get(self, request):
        priority_names = Task.get_priority_names()
        category_names = Task.get_category_names()
        status_names = Task.get_status_names()

        response = Response()
        response.data = {
            "priority_names": priority_names,
            "category_names": category_names,
            "status_names": status_names
        }
        return response
