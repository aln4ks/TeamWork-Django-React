import requests


class YandexAPI:

    def __init__(self, token):
        self.token = token

    def get_headers(self):
        return {
            "Content-Type": "application/json",
            "Authorization": "OAuth {}".format(self.token)
        }

    def get_file_list(self):
        files_url = "https://cloud-api.yandex.net/v1/disk/resources/files"
        headers = self.get_headers()
        response = requests.get(files_url, headers=headers)
        return response.json()

    def _get_upload_link(self, disk_file_path):
        upload_url = "https://cloud-api.yandex.net/v1/disk/resources/upload"
        headers = self.get_headers()
        params = {"path": disk_file_path, "overwrite": "true"}
        response = requests.get(upload_url, headers=headers, params=params)
        return response.json()

    def _get_load_link(self, disk_file_path):
        load_url = "https://cloud-api.yandex.net/v1/disk/resources/download"
        headers = self.get_headers()
        params = {"path": disk_file_path}
        response = requests.get(load_url, headers=headers, params=params)
        return response.json()

    def upload_file_to_yandex(self, disk_file_path, filename):
        link_dict = self._get_upload_link(disk_file_path=disk_file_path)
        href = link_dict.get("href", "")
        response = requests.put(href, data=open(filename, "rb"))
        if response.status_code == 201:
            response.data = {
                "success_upload": "Документ успешно загружен!",
            }
        return response

    def load_file_from_yandex(self, disk_file_path):
        link_dict = self._get_load_link(disk_file_path=disk_file_path)
        href = link_dict.get("href")
        response = requests.get(href)
        return response

    def delete_from_yandex(self, disk_file_path):
        delete_file_url = "https://cloud-api.yandex.net/v1/disk/resources"
        headers = self.get_headers()
        params = {"path": disk_file_path}
        response = requests.delete(delete_file_url, headers=headers, params=params)
        if response.status_code == 204:
            response.data = {
                "success": "Документ успешно удалён!",
            }
        else:
            response.data = {
                "error": "Произошла ошибка, выполните удаление позже!",
            }
        return response
