# import os
# import subprocess
# import time
#
# CURRENT_DIRECTORY = os.getcwd()
# directories = os.listdir(CURRENT_DIRECTORY)
# NON_ANGULAR_DIRS = ['static', 'templates', 'venvP', '__pycache__']
#
# for directory in directories:
#     if "." not in directory and directory not in NON_ANGULAR_DIRS:
#         ANGULAR_PROJECT_PATH = os.path.join(CURRENT_DIRECTORY, directory)
#         DIST_PATH = os.path.join(ANGULAR_PROJECT_PATH, 'dist', directory)
#
# FLASK_STATIC_PATH = os.path.join(CURRENT_DIRECTORY, 'static')
# FLASK_TEMPLATES_PATH = os.path.join(CURRENT_DIRECTORY, 'templates')
#
# print(ANGULAR_PROJECT_PATH)
#
# # subprocess.call(('cd ' + ANGULAR_PROJECT_PATH + ' && ng build --watch --base-href /static/ &'), shell=True)
# subprocess.call(('cd ' + ANGULAR_PROJECT_PATH + ' && ng build --watch --deploy-url /static/ &'), shell=True)
#
# time.sleep(2)
#
# dir_exists = True
# print(dir_exists)
#
# while dir_exists:
#     print("Ok")
#     try:
#         files = os.listdir(DIST_PATH)
#         static_files = ""
#         html_files = ""
#         for file in files:
#             if '.js' in file or '.js.map' in file or '.ico' in file:
#                 static_files += (file + ' ')
#             if '.html' in file:
#                 html_files += (file + ' ')
#         if len(static_files) > 0:
#             subprocess.call(('cd ' + DIST_PATH + ' &&' + ' mv ' + static_files + FLASK_STATIC_PATH), shell=True)
#         if len(html_files) > 0:
#             subprocess.call(('cd ' + DIST_PATH + ' &&' + ' mv ' + html_files + FLASK_TEMPLATES_PATH), shell=True)
#     except Exception as e:
#         dir_exists = False
#         print(e)
#     time.sleep(10)

import os
import subprocess
import shutil
import time
import glob

ANGULAR_FRONTEND_FOLDER = "angular-frontend"
STATIC_FOLDER = "static"
TEMPLATES_FOLDER = "templates"


def copy_files_to_static():
    angular_frontend_dist_path = os.path.join(os.getcwd(), ANGULAR_FRONTEND_FOLDER, "dist", ANGULAR_FRONTEND_FOLDER)

    # Copy generated JS files to static folder
    static_files = ["*.js", "*.js.map"]
    for pattern in static_files:
        files = glob.glob(os.path.join(angular_frontend_dist_path, pattern))
        for file in files:
            shutil.copy(file, STATIC_FOLDER)

    # Copy index.html to templates folder
    shutil.copy(os.path.join(angular_frontend_dist_path, "index.html"), TEMPLATES_FOLDER)


def main():
    # Build the Angular frontend project
    angular_frontend_path = os.path.join(os.getcwd(), ANGULAR_FRONTEND_FOLDER)
    subprocess.call("ng build --deploy-url /static/", shell=True, cwd=angular_frontend_path)

    while True:
        copy_files_to_static()
        time.sleep(10)


if __name__ == "__main__":
    main()

