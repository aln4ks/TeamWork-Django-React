from django.contrib.auth.password_validation import validate_password
from rest_framework import status
from rest_framework.response import Response


def check_password_complexity(request):
    try:
        validate_password(request.data["password"])
    except Exception as password_error:
        error_array = []
        for item in password_error:
            error_array.append(item)
        response = Response(status=status.HTTP_400_BAD_REQUEST)
        response.data = {
            "password": error_array
        }
        return response
