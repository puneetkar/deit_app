from django.contrib.auth import get_user_model
from django.core.mail import send_mail

from .models import DietPlan
from .views import calculate_bmi_category


def send_daily_diet_emails():
    User = get_user_model()
    users = User.objects.filter(wants_daily_email=True)
    for user in users:
        bmi, category = calculate_bmi_category(user.height_cm, user.weight_kg)
        plan = None
        if category != "unknown":
            plan = DietPlan.objects.filter(code=category).first()
        subject = "Your Daily Diet Suggestion"
        message_lines = [
            f"Hello {user.username},",
            f"BMI: {bmi if bmi is not None else 'N/A'} | Category: {category}",
            "",
            plan.text if plan else "Balanced diet: vegetables, fruits, whole grains, lean protein, healthy fats.",
        ]
        message = "\n".join(message_lines)
        send_mail(subject, message, None, [user.email])



