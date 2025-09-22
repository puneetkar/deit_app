from django.urls import path
from django.views.generic import TemplateView
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views


urlpatterns = [
    # Auth
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Profile
    path('profile/', views.ProfileView.as_view(), name='profile'),
    # Diet
    path('diet/suggestion/', views.DietSuggestionView.as_view(), name='diet-suggestion'),
    path('diet/plans/', views.DietPlanListView.as_view(), name='diet-plans'),
    path('experts/list/', views.DietExpertListAPI.as_view(), name='experts-list'),
    path('quiz/questions/', views.QuizQuestionsAPI.as_view(), name='quiz-questions'),
    path('leads/', views.LeadSubmissionAPI.as_view(), name='lead-submission'),
    # Web pages
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    path('experts/', views.ExpertListPageView.as_view(), name='experts'),
    path('suggestions/', views.SuggestionsPageView.as_view(), name='suggestions'),
    path('signup/', views.signup_view, name='signup'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='home'), name='logout'),
    path('quiz/', views.QuizView.as_view(), name='quiz'),
]



