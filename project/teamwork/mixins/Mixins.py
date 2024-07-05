from io import BytesIO
import base64
import matplotlib.pyplot as plt

from teamwork.models import Project, Task


class GraphicsMixin:
    @staticmethod
    def _get_project(project_id):
        return Project.objects.get(id=project_id)

    def _get_completed_tasks(self, project_id):
        project = self._get_project(project_id)
        completed_tasks = Task.objects.filter(project=project, completed_date__isnull=False)
        return completed_tasks

    @staticmethod
    def do_image_base64():
        image_stream = BytesIO()
        plt.savefig(image_stream, format="png")
        plt.close()
        image_stream.seek(0)
        image_base64 = base64.b64encode(image_stream.getvalue()).decode("utf-8")
        return image_base64
