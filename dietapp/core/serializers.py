from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import DietPlan, DietExpert, QuizQuestion, LeadSubmission


User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            'username', 'email', 'password',
            'height_cm', 'weight_kg', 'dietary_preference', 'wants_daily_email',
        )

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'height_cm', 'weight_kg', 'dietary_preference', 'wants_daily_email',
        )
        read_only_fields = ('id', 'username', 'email')


class DietPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietPlan
        fields = ('code', 'title', 'text')

class DietExpertSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietExpert
        fields = ('id', 'name', 'specialty', 'bio', 'email', 'image_url')


class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = ('id', 'text')  # do not expose correct answer


class LeadSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadSubmission
        fields = ("id", "name", "email", "phone", "consent", "source", "created_at")
        read_only_fields = ("id", "created_at")

