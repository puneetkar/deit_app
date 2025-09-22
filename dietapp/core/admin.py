from django.contrib import admin
from django.contrib.auth import get_user_model

from .models import DietPlan, DietExpert, QuizQuestion, QuizResponse, LeadSubmission


User = get_user_model()


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'height_cm', 'weight_kg', 'wants_daily_email')
    search_fields = ('username', 'email')


@admin.register(DietPlan)
class DietPlanAdmin(admin.ModelAdmin):
    list_display = ('code', 'title')
    search_fields = ('code', 'title')


@admin.register(DietExpert)
class DietExpertAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialty', 'email')
    search_fields = ('name', 'specialty', 'email')


@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ("text", "is_good")
    list_filter = ("is_good",)


@admin.register(QuizResponse)
class QuizResponseAdmin(admin.ModelAdmin):
    list_display = ("user", "question", "answer_is_good", "created_at")
    list_filter = ("answer_is_good", "created_at")


@admin.register(LeadSubmission)
class LeadSubmissionAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "consent", "source", "created_at")
    search_fields = ("name", "email", "phone", "source")
    list_filter = ("consent", "source")
