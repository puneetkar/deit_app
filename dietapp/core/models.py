from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Custom user model with extra diet-related fields."""

    height_cm = models.IntegerField(null=True, blank=True)
    weight_kg = models.FloatField(null=True, blank=True)
    dietary_preference = models.CharField(max_length=255, blank=True, default="")
    wants_daily_email = models.BooleanField(default=True)

    def __str__(self) -> str:  # pragma: no cover - trivial
        return self.username


class DietPlan(models.Model):
    """Diet plan content keyed by BMI category code."""

    code = models.CharField(max_length=64, unique=True)
    title = models.CharField(max_length=255)
    text = models.TextField()

    def __str__(self) -> str:  # pragma: no cover - trivial
        return f"{self.code}: {self.title}"

class DietExpert(models.Model):
    """Diet expert directory for the website."""

    name = models.CharField(max_length=255)
    specialty = models.CharField(max_length=255, blank=True, default="")
    bio = models.TextField(blank=True, default="")
    email = models.EmailField(blank=True, default="")
    image_url = models.URLField(blank=True, default="")

    def __str__(self) -> str:  # pragma: no cover - trivial
        return self.name


class QuizQuestion(models.Model):
    """Simple quiz question with correct answer being good/bad."""

    text = models.CharField(max_length=255)
    # whether the food is considered good (True) or not (False)
    is_good = models.BooleanField(default=True)

    def __str__(self) -> str:  # pragma: no cover
        return self.text


class QuizResponse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE)
    answer_is_good = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "question")


class LeadSubmission(models.Model):
    """Leads captured from marketing landing pages."""

    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, default="")
    phone = models.CharField(max_length=32, blank=True, default="")
    consent = models.BooleanField(default=False)
    source = models.CharField(max_length=128, blank=True, default="gut-landing")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.name} ({self.phone or self.email})"

