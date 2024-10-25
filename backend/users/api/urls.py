from django.urls import path
from knox import views as knox_views
from users.api.api import (
    LoginView, WriteReview,
    AuthMe, UserRegister,
    UpdateUserView, DeleteUserView,
)

urlpatterns = [
    path('auth/user/delete', DeleteUserView.as_view()),
    path('auth/user/update', UpdateUserView.as_view()),
    path('auth/me', AuthMe.as_view()),
    path('auth/register', UserRegister.as_view()),
    path('auth/login', LoginView.as_view(), name='knox_login'),
    path('auth/logout', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('auth/logoutall', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),
]

urlpatterns += [
    path('write-review', WriteReview.as_view()),
]
