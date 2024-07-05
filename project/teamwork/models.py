import datetime

from django.contrib.auth.models import AbstractUser
from django.db import models
from django_softdelete.models import SoftDeleteModel

__all__ = (
    "Employee",
    "Project",
    "Task",
    "Comment",
    "EventScheduler"
)
POSITION_CHOICES = (
    ("Junior developer", "Junior developer"),
    ("Middle developer", "Middle developer"),
    ("Senior developer", "Senior developer"),
    ("Team lead", "Team lead"),
    ("Project manager", "Project manager"),
)
PRIORITY_CHOICES = (
    ("Очень низкий", "Очень низкий"),
    ("Низкий", "Низкий"),
    ("Средний", "Средний"),
    ("Важный", "Важный"),
    ("Срочный", "Срочный"),
)
CATEGORY_CHOICES = (
    ("Баг", "Баг"),
    ("Задача", "Задача"),
    ("Epic", "Epic"),
    ("Рефакторинг", "Рефакторинг")
)
STATUS_CHOICES = (
    ("Созданo", "Созданo"),
    ("Приостановлено", "Приостановлено"),
    ("В работе", "В работе"),
    ("В тестировании", "В тестировании"),
    ("На ревью", "На ревью"),
    ("Выполнено", "Выполнено"),
)


class Employee(AbstractUser, SoftDeleteModel):  # для физического удаления записи использовать hard_delete()
    """
    Модель сотрудника
    """
    email = models.EmailField(max_length=128, unique=True, verbose_name="Email")
    password = models.CharField(max_length=128, verbose_name="Пароль")
    post = models.CharField(max_length=128, choices=POSITION_CHOICES, verbose_name="Должность")
    photo = models.ImageField(upload_to="static/photos/users", null=True, blank=True)
    username = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        verbose_name = "Сотрудник"
        verbose_name_plural = "Сотрудники"
        ordering = ("first_name",)

    @staticmethod
    def get_post_names():
        post_names = [x[0] for x in POSITION_CHOICES]
        return post_names

    @staticmethod
    def get_queryset():
        return Employee.objects.all()


class Project(SoftDeleteModel):
    """
    Модель проекта
    """
    name = models.CharField(max_length=128, verbose_name="Название")
    description = models.CharField(max_length=200, verbose_name="Описание")
    employee = models.ManyToManyField(Employee, verbose_name="Сотрудник проекта", related_name="project_as_employee")
    creator = models.ForeignKey(Employee, verbose_name="Создатель проекта", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=True, verbose_name="Дата создания")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Проект"
        verbose_name_plural = "Проекты"
        ordering = ("id",)

    @staticmethod
    def get_employees_of_project(project_id):
        try:
            project = Project.objects.get(pk=project_id)
            employees = project.employee.all()
            return employees
        except Project.DoesNotExist:
            return None

    def get_creator_name(self):
        return f"{self.creator.first_name} {self.creator.last_name}"


class Task(SoftDeleteModel):
    """
    Модель задачи
    """
    name = models.CharField(max_length=128, verbose_name="Название")
    description = models.CharField(max_length=200, verbose_name="Описание")
    created_at = models.DateTimeField(verbose_name="Дата создания")
    deadline = models.DateTimeField(verbose_name="Дата окончания")
    priority = models.CharField(max_length=128, choices=PRIORITY_CHOICES, verbose_name="Приоритет")
    category = models.CharField(max_length=128, choices=CATEGORY_CHOICES, verbose_name="Тип задачи")
    creator = models.ForeignKey(Employee, verbose_name="Создатель задачи", related_name="task_creator",
                                on_delete=models.CASCADE)
    executor = models.ForeignKey(Employee, verbose_name="Исполнитель", related_name="task_executor",
                                 on_delete=models.CASCADE)
    status = models.CharField(max_length=128, choices=STATUS_CHOICES, verbose_name="Статус задачи")
    project = models.ForeignKey(Project, verbose_name="Проект", on_delete=models.CASCADE)
    completed_date = models.DateTimeField(verbose_name="Дата фактического выполнения задачи", null=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.pk:
            self.created_at = datetime.datetime.now()
        super().save(*args, **kwargs)

    @staticmethod
    def get_user_tasks(user):
        return Task.objects.filter(executor=user)

    @staticmethod
    def get_priority_names():
        priority_names = [x[0] for x in PRIORITY_CHOICES]
        return priority_names

    @staticmethod
    def get_category_names():
        category_names = [x[0] for x in CATEGORY_CHOICES]
        return category_names

    @staticmethod
    def get_status_names():
        status_names = [x[0] for x in STATUS_CHOICES]
        return status_names

    class Meta:
        verbose_name = "Задача"
        verbose_name_plural = "Задачи"
        ordering = ("created_at",)


class Comment(SoftDeleteModel):
    """
    Модель комментария
    """
    description = models.CharField(max_length=200, verbose_name="Описание")
    created_at = models.DateTimeField(auto_now=True, verbose_name="Дата создания")
    author = models.ForeignKey(Employee, verbose_name="Автор комментария", on_delete=models.CASCADE)
    task = models.ForeignKey(Task, verbose_name="Задача", on_delete=models.CASCADE)

    def __str__(self):
        return self.description

    class Meta:
        verbose_name = "Комментарий"
        verbose_name_plural = "Комментарии"
        ordering = ("task",)


class EventScheduler(SoftDeleteModel):
    """
    Модель календаря событий
    """
    employee = models.ForeignKey(Employee, verbose_name="Автор события", on_delete=models.CASCADE)
    time_begin = models.DateTimeField(verbose_name="Дата начала события")
    time_end = models.DateTimeField(verbose_name="Дата окончания события")
    name = models.CharField(max_length=200, verbose_name="Название")
    created_at = models.DateTimeField(auto_now=True, verbose_name="Дата создания")

    def __str__(self):
        return f"{self.employee} событие: {self.name}"

    class Meta:
        verbose_name = "Календарь событий"
        verbose_name_plural = "Календарь событий"
        ordering = ("employee",)
