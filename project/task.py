import time
import threading

from datetime import timedelta
from django.utils import timezone

import django
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")
django.setup()
from teamwork.models import Task, STATUS_CHOICES

DELAY = 21600


def delete_old_completed_tasks():
    tasks_to_delete = Task.objects.filter(
        status=STATUS_CHOICES[-1][0], completed_date__lte=timezone.now() - timedelta(days=7)
    )
    tasks_to_delete.delete()


while True:
    time.sleep(DELAY)
    thread = threading.Thread(target=delete_old_completed_tasks)
    thread.start()
