import datetime

import jwt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import APIView

from teamwork.models import Employee
from teamwork.serializers import UserSerializer
from teamwork.views.auxiliary import auth_required, get_user

from teamwork.logic.check_password_logic import check_password_complexity


class RegisterView(APIView):
    """
    Регистрация пользователя
    """
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        password_errors = check_password_complexity(request)
        if password_errors:
            return password_errors

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    Аутентификация пользователя
    """
    def post(self, request):
        email = request.data["email"]
        password = request.data["password"]

        user = Employee.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed("Пользователя не существует!")

        if not user.check_password(password):
            raise AuthenticationFailed("Введён некорректный пароль!")

        payload = {
            "id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=120),
            "iat": datetime.datetime.utcnow()
        }
        token = jwt.encode(payload, "secret", algorithm="HS256")

        response = Response()
        response.set_cookie(key="jwt_token", value=token, httponly=True)
        response.data = {
            "jwt_token": token
        }

        return response


class LogoutView(APIView):
    """
    Выход пользователя
    """
    @auth_required
    def get(self, request):
        response = Response()
        response.delete_cookie("jwt_token")
        response.data = {
            "message": "success logout!"
        }

        return response


class UserProfileView(APIView):
    """
    Вьюха профиля пользователя
    """
    @auth_required
    def get(self, request):
        """
        Просмотр профиля пользователя
        """
        user = get_user(request)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    @auth_required
    def patch(self, request):
        """
        Редактирование профиля пользователя
        """
        user = get_user(request)
        password = request.data.get("password")
        if password:
            password_errors = check_password_complexity(request)
            if password_errors:
                return password_errors

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
