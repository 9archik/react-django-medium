from django.urls import path
from .views import (
    RegisterView,
    MyTokenObtainPairView,
    LoginView,
    RefreshTokenView,
    CheckTokenView,
    LogoutView,
    UserInfoView
)


urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view(), name="login_view"),
    path("logout/", LogoutView.as_view(), name="logout_view"),
    path("user_info/", UserInfoView.as_view(), name="user_info_view"),
    path("token/refresh/", RefreshTokenView.as_view(), name="refresh_token"),
    path("token/", CheckTokenView.as_view(), name="check_token"),
]
