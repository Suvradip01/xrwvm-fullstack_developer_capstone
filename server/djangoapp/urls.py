from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'

urlpatterns = [
    # path for login
    path('login', views.login_user, name='login'),

    # path for logout
    path('logout', views.logout_user, name='logout'),

    # path for registration
    path('register', views.register_user, name='register'),

    # ✅ path for dealers
    path('dealers/', views.dealers_view, name='dealers'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
