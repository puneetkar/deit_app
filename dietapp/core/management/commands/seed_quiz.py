from django.core.management.base import BaseCommand

from core.models import QuizQuestion


class Command(BaseCommand):
    help = "Seed basic quiz questions"

    def handle(self, *args, **options):
        items = [
            ("Leafy greens (spinach, kale)", True),
            ("Sugary soft drinks", False),
            ("Whole grains (brown rice, oats)", True),
            ("Ultra-processed snacks (chips)", False),
            ("Lean proteins (fish, tofu)", True),
            ("Deep-fried foods", False),
            ("Fruits (berries, apples)", True),
        ]
        created = 0
        for text, is_good in items:
            _, was_created = QuizQuestion.objects.get_or_create(text=text, defaults={"is_good": is_good})
            if was_created:
                created += 1
        self.stdout.write(self.style.SUCCESS(f"Seeded {created} quiz questions"))


