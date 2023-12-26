from django.urls import path
from .views import CommentView, UpdateCommentView

urlpatterns = [
    path("comments/<int:post_id>/", CommentView.as_view(), name="comments"),
    path("updatecomment/<int:comment_id>/", UpdateCommentView.as_view(), name="comment")
]
