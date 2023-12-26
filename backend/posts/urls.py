from django.urls import path
from .views import PostView, PostIDView, AddPostView, UserPostsView

urlpatterns = [
    path("posts/", PostView.as_view(), name="get-posts"),
    path("post/<int:id>/", PostIDView.as_view(), name="get-post"),
    path("add_post/", AddPostView.as_view(), name="add-post"),
    path("user_posts/", UserPostsView.as_view(), name="user-posts")
    
]
