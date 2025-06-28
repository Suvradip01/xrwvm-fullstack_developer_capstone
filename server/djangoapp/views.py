from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from django.views.decorators.csrf import csrf_exempt
import json
import logging

# Logger instance
logger = logging.getLogger(__name__)

# ---------- LOGIN ----------
@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('userName')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"userName": user.username, "status": "Authenticated"})
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)
    return JsonResponse({"error": "Invalid request method"}, status=400)

# ---------- LOGOUT ----------
@csrf_exempt
def logout_user(request):
    if request.method == 'GET':
        logout(request)
        return JsonResponse({"userName": ""})
    return JsonResponse({"error": "Invalid request method"}, status=400)

# ---------- REGISTER ----------
@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get("userName")
        password = data.get("password")
        first_name = data.get("firstName")
        last_name = data.get("lastName")
        email = data.get("email")

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Already Registered"}, status=400)

        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email
        )

        login(request, user)
        return JsonResponse({"status": True, "userName": user.username})

    return JsonResponse({"error": "Invalid request method"}, status=400)
