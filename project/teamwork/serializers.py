import base64
import datetime

from rest_framework import serializers
from .models import Employee, Project, Task, EventScheduler, Comment, STATUS_CHOICES


class UserSerializer(serializers.ModelSerializer):
    photo_data = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ["id", "first_name", "last_name", "email", "photo", "password", "post", "date_joined", "photo_data"]
        extra_kwargs = {
            "photo": {"write_only": True},
            "password": {"write_only": True},
            "date_joined": {"read_only": True},
            "photo_data": {"read_only": True}
        }

    @staticmethod
    def get_photo_data(obj):
        if obj.photo:
            with open(obj.photo.path, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read())
                return encoded_string.decode('utf-8')
        return None

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)


class ProjectSerializer(serializers.ModelSerializer):
    tasks = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ["id", "name", "description", "employee", "creator", "tasks", "created_at"]
        extra_kwargs = {
            "created_at": {"read_only": True}
        }

    @staticmethod
    def get_tasks(project):
        return Task.objects.filter(project=project.id).values()


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "id", "name", "description", "deadline", "priority", "category", "executor", "status", "project",
            "creator", "created_at", "completed_date", "deleted_at"
        ]
        extra_kwargs = {
            "created_at": {"read_only": True},
            "completed_date": {"read_only": True},
            "deleted_at": {"read_only": True}
        }

    def update(self, instance, validated_data):
        status = validated_data.get("status", None)
        if status == STATUS_CHOICES[-1][0]:
            instance.completed_date = datetime.datetime.now()
        if status != STATUS_CHOICES[-1][0]:
            instance.completed_date = None
        return super().update(instance, validated_data)


class EventSchedulerSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventScheduler
        fields = [
            "id", "employee", "time_begin", "time_end", "name", "created_at"
        ]
        extra_kwargs = {
            "created_at": {"read_only": True},
        }

    def validate(self, data):
        if data["time_begin"] > data["time_end"]:
            raise serializers.ValidationError({"Дата начала": "Дата начала не может быть больше даты окончания!"})
        return data


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            "id", "description", "author", "task", "created_at"
        ]
        extra_kwargs = {
            "created_at": {"read_only": True},
        }
