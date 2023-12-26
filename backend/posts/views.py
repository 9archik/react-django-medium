from django.contrib import admin
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Post
from .serializers import PostSerializer
from django.conf import settings
import jwt
from datetime import datetime, timedelta
from users.models import User
from PIL import Image


def is_image(file):
    try:
        image = Image.open(file)
        image.verify()
        return True
    except:
        return False


class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "theme", "created_at")
    search_fields = ("title", "theme")


admin.site.register(Post, PostAdmin)


class PostView(APIView):
    def get(self, request):
        posts = Post.objects.all()
        data = []
        for post in posts:
            obj = {
                "title": post.title,
                "image": "http://9archik" + post.image.url if post.image else None,
                "theme": post.theme,
                "id": post.id,
            }
            data.append(obj)
        return Response({"posts": data})


class PostIDView(APIView):
    def get(self, request, id):
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return Response({"value": 404}, status=404)

        return Response(
            {
                "title": post.title,
                "content": post.content,
                "image": "http://9archikblog.ru" + post.image.url
                if post.image
                else None,
                "theme": post.theme,
                "created_at": post.created_at,
                "user": {
                    "image": post.user.avatar.url if post.user.avatar else None,
                    "username": post.user.username,
                },
            }
        )

    def put(self, request, id):
        try:
            post = Post.objects.get(id=id)
            token = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE"])
        except Post.DoesNotExist:
            return Response({"value": 404}, status=404)

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            exp_timestamp = decoded_token["exp"]
            user_id = decoded_token["user_id"]
            user = User.objects.get(id=user_id)
            if datetime.now().timestamp() > exp_timestamp:
                return Response(status=401)
        except (
            jwt.exceptions.DecodeError,
            jwt.exceptions.ExpiredSignatureError,
            KeyError,
        ):
            return Response(status=401)

        try:
            if post.user == user:
                image = request.data["image"]
                if image:
                    if is_image(image):
                        post.image = image
            post.theme = request.data["theme"]
            post.content = request.data["content"]
            post.title = request.data["title"]
            post.save()
            return Response({"status": "post update"}, status=200)
        except:
            return Response(status=429)

    def delete(self, request, id):
        try:
            post = Post.objects.get(id=id)
            token = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE"])
        except Post.DoesNotExist:
            return Response({"value": 404}, status=404)

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            exp_timestamp = decoded_token["exp"]
            user_id = decoded_token["user_id"]
            user = User.objects.get(id=user_id)
            if datetime.now().timestamp() > exp_timestamp:
                return Response(status=401)
        except (
            jwt.exceptions.DecodeError,
            jwt.exceptions.ExpiredSignatureError,
            KeyError,
        ):
            return Response(status=401)

        if post.user == user:
            post.delete()

            posts = Post.objects.filter(user=user)
            data = []
            for post in posts:
                obj = {
                    "title": post.title,
                    "id": post.id,
                }
                data.append(obj)
            return Response(data)
        else:
            return Response(status=429)


class AddPostView(APIView):
    def post(self, request):
        token = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE"])
        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            exp_timestamp = decoded_token["exp"]
            user_id = decoded_token["user_id"]
            if datetime.now().timestamp() > exp_timestamp:
                return Response(status=401)
        except (
            jwt.exceptions.DecodeError,
            jwt.exceptions.ExpiredSignatureError,
            KeyError,
        ):
            return Response(status=401)

        data = {
            "title": request.data["title"],
            "content": request.data["content"],
            "theme": request.data["theme"],
            "user_id": user_id,
            "image": request.data["image"],
        }

        serializer = PostSerializer(data=data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class UserPostsView(APIView):
    def get(self, request):
        token = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE"])
        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            exp_timestamp = decoded_token["exp"]
            user_id = decoded_token["user_id"]
            if datetime.now().timestamp() > exp_timestamp:
                return Response(status=401)
        except (
            jwt.exceptions.DecodeError,
            jwt.exceptions.ExpiredSignatureError,
            KeyError,
        ):
            return Response(status=401)

        user = User.objects.get(id=user_id)
        posts = Post.objects.filter(user=user)
        data = []
        for post in posts:
            obj = {
                "title": post.title,
                "id": post.id,
            }
            data.append(obj)
        return Response(data)
