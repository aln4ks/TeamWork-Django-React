import jwt
import datetime


class RefreshTokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if "jwt_token" in request.COOKIES:
            try:
                payload = jwt.decode(request.COOKIES["jwt_token"], "secret", algorithms=["HS256"])
                new_jwt_token = jwt.encode({
                    "id": payload["id"],
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=120),
                    "iat": datetime.datetime.utcnow()
                }, "secret", algorithm="HS256")
                response = self.get_response(request)

                response.set_cookie("jwt_token", new_jwt_token)
                return response
            except jwt.ExpiredSignatureError:
                response = self.get_response(request)
                return response
        return self.get_response(request)
