from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from teamwork.models import EventScheduler
from teamwork.serializers import EventSchedulerSerializer
from teamwork.views.auxiliary import auth_required, get_user


class EventSchedulerView(APIView):
    serializer_class = EventSchedulerSerializer

    @staticmethod
    def _get_event(event_id):
        return EventScheduler.objects.get(id=event_id)

    @auth_required
    def get(self, request):
        """
        Просмотр календаря событий пользователя
        """
        user = get_user(request)
        events = EventScheduler.objects.filter(employee=user)
        serializer = self.serializer_class(events, many=True)
        return Response(serializer.data)

    @auth_required
    def post(self, request):
        """
        Добавление события
        """
        user = get_user(request)
        req_data = request.data.copy()
        req_data["employee"] = user.id
        serializer = self.serializer_class(data=req_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @auth_required
    def patch(self, request, event_id=None):
        """
        Редактирование события
        """
        if event_id:
            event = self._get_event(event_id)
            serializer = self.serializer_class(event, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @auth_required
    def delete(self, request, event_id=None):
        """
        Удаление события
        """
        response = Response()
        if event_id:
            event = self._get_event(event_id)
            event.delete()
            response.data = {
                "success_message": "Событие успешно удалёно!",
            }
            return response
