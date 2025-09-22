from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm


User = get_user_model()


class SignupForm(UserCreationForm):
    email = forms.EmailField(required=True)
    height_cm = forms.IntegerField(required=False, min_value=1, label="Height (cm)")
    weight_kg = forms.FloatField(required=False, min_value=1, label="Weight (kg)")
    dietary_preference = forms.CharField(required=False, max_length=255)
    wants_daily_email = forms.BooleanField(required=False, initial=True)

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password1",
            "password2",
            "height_cm",
            "weight_kg",
            "dietary_preference",
            "wants_daily_email",
        )


