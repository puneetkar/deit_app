from django.core.management.base import BaseCommand

from core.models import DietExpert


class Command(BaseCommand):
    help = "Seed a few sample diet experts"

    def handle(self, *args, **options):
        samples = [
            dict(
                name="Dr. Maya Kapoor",
                specialty="Clinical Nutrition",
                bio="Board-certified nutritionist focusing on metabolic health, weight management, and PCOS.",
                email="maya.kapoor@example.com",
                image_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
            ),
            dict(
                name="Rahul Verma, RD",
                specialty="Sports Nutrition",
                bio="Registered dietitian helping athletes optimize performance and recovery with evidence-based plans.",
                email="rahul.verma@example.com",
                image_url="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop",
            ),
        ]
        created = 0
        for data in samples:
            obj, was_created = DietExpert.objects.get_or_create(name=data["name"], defaults=data)
            if was_created:
                created += 1
        self.stdout.write(self.style.SUCCESS(f"Seeded {created} experts (idempotent)"))


