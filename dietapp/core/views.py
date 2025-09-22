from typing import Tuple

from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, response, status
from rest_framework.views import APIView

from .models import DietPlan, DietExpert, QuizQuestion, QuizResponse, LeadSubmission
from .forms import SignupForm
from .serializers import (
    RegisterSerializer, UserSerializer, DietPlanSerializer,
    DietExpertSerializer, QuizQuestionSerializer, LeadSubmissionSerializer,
)


User = get_user_model()


def calculate_bmi_category(height_cm: int | None, weight_kg: float | None) -> Tuple[float | None, str]:
    if not height_cm or not weight_kg or height_cm <= 0 or weight_kg <= 0:
        return None, "unknown"
    height_m = height_cm / 100.0
    bmi = weight_kg / (height_m * height_m)
    if bmi < 18.5:
        category = "underweight"
    elif 18.5 <= bmi <= 24.9:
        category = "normal"
    elif 25 <= bmi <= 29.9:
        category = "overweight"
    else:
        category = "obese"
    return round(bmi, 1), category


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return response.Response(serializer.data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return response.Response(serializer.data)


class DietSuggestionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user: User = request.user
        bmi, category = calculate_bmi_category(user.height_cm, user.weight_kg)
        plan = None
        if category != "unknown":
            plan = DietPlan.objects.filter(code=category).first()
        suggestion = {
            "bmi": bmi,
            "category": category,
            "suggestion": plan.text if plan else "Focus on a balanced diet rich in vegetables, lean proteins, whole grains, and healthy fats. Stay hydrated and exercise regularly.",
        }
        return response.Response(suggestion)


class DietPlanListView(generics.ListAPIView):
    queryset = DietPlan.objects.all().order_by('code')
    serializer_class = DietPlanSerializer
    permission_classes = [permissions.AllowAny]


class DietExpertListAPI(generics.ListAPIView):
    queryset = DietExpert.objects.all().order_by('name')
    serializer_class = DietExpertSerializer
    permission_classes = [permissions.AllowAny]


class QuizQuestionsAPI(generics.ListAPIView):
    queryset = QuizQuestion.objects.all().order_by('id')
    serializer_class = QuizQuestionSerializer
    permission_classes = [permissions.AllowAny]


class LeadSubmissionAPI(generics.CreateAPIView):
    queryset = LeadSubmission.objects.all()
    serializer_class = LeadSubmissionSerializer
    permission_classes = [permissions.AllowAny]


# Web pages
from django.views.generic import ListView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import login
from django.shortcuts import redirect, render


class ExpertListPageView(ListView):
    template_name = 'experts.html'
    model = DietExpert
    context_object_name = 'experts'
    paginate_by = 12


class SuggestionsPageView(LoginRequiredMixin, TemplateView):
    template_name = 'suggestions.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        bmi, category = calculate_bmi_category(user.height_cm, user.weight_kg)
        plan = None
        if category != 'unknown':
            plan = DietPlan.objects.filter(code=category).first()
        context.update({
            'bmi': bmi,
            'category': category,
            'suggestion_text': plan.text if plan else "Focus on a balanced diet rich in vegetables, lean proteins, whole grains, and healthy fats. Stay hydrated and exercise regularly.",
        })
        return context


def signup_view(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('suggestions')
    else:
        form = SignupForm()
    return render(request, 'signup.html', { 'form': form })


class QuizView(LoginRequiredMixin, TemplateView):
    template_name = 'quiz.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        questions = list(QuizQuestion.objects.all()[:10])
        context['questions'] = questions
        # Score so far
        responses = QuizResponse.objects.filter(user=self.request.user)
        correct = sum(1 for r in responses if r.answer_is_good == r.question.is_good)
        total = responses.count()
        context['score'] = correct
        context['total'] = total
        return context

    def post(self, request):
        for key, value in request.POST.items():
            if key.startswith('q_'):
                qid = key.split('_', 1)[1]
                try:
                    question = QuizQuestion.objects.get(pk=int(qid))
                except (QuizQuestion.DoesNotExist, ValueError):
                    continue
                answer_is_good = (value == 'good')
                QuizResponse.objects.update_or_create(
                    user=request.user,
                    question=question,
                    defaults={'answer_is_good': answer_is_good},
                )
        return redirect('quiz')

