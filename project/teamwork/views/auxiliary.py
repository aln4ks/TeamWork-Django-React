from functools import wraps
import jwt

from rest_framework.exceptions import AuthenticationFailed
from teamwork.models import Employee


def auth_required(view_func):
    @wraps(view_func)
    def wrapper(self, request, *args, **kwargs):
        token = request.headers.get("token")
        if not token:
            token = request.COOKIES.get("jwt_token")
        if not token:
            raise AuthenticationFailed("Не авторизован!")
        try:
            jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Не авторизован!")

        return view_func(self, request, *args, **kwargs)

    return wrapper


def get_user(request):
    token = request.headers.get("token")
    if not token:
        token = request.COOKIES.get("jwt_token")
    payload = jwt.decode(token, "secret", algorithms=["HS256"])
    user = Employee.objects.get(id=payload["id"])
    return user
