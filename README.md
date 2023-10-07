# Image_Color_Analyzer

The Image Color Analyzer is a web application that allows users to analyze images and view their top colors. Users can register, log in, and start using the app to upload images and see their color analysis results.

---

## Features
- User registration and authentication system
- Upload images for color analysis (images, image analyses, and user information are stored in a database)
- View color analysis results for uploaded images

---

## Tech Stack

- ### Frontend:
    ![ Angular ](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=Angular) ![ TypeScript ](https://img.shields.io/badge/Typescript-41454A?style=for-the-badge&logo=TypeScript) ![ Bootstrap ](https://img.shields.io/badge/Bootstrap-41454A?style=for-the-badge&logo=Bootstrap)

- ### Backend:
    ![ Flask ](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=Flask) ![ Python ](https://img.shields.io/badge/Python-ECD53F?style=for-the-badge&logo=Python)

- ### Server:
    ![ Gunicorn ](https://img.shields.io/badge/Gunicorn-41454A?style=for-the-badge&logo=Gunicorn) ![ Nginx ](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=Nginx)

- ### Database:
    ![ PostgreSQL ](https://img.shields.io/badge/PostgreSQL-41454A?style=for-the-badge&logo=PostgreSQL)

- ### Containerization:
    ![ Docker ](https://img.shields.io/badge/Docker-41454A?style=for-the-badge&logo=Docker)

---

## Getting Started

Running the Image Color Analyzer project locally will be done using `Docker`. You should follow these steps:

1. Make sure you have Docker installed on your machine. If you don't have Docker installed, you can [install it from here](https://docs.docker.com/get-docker/).

2. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/BozhidarMindov/Image_Color_Analyzer.git
   ```

3. Navigate to the project root directory:

   ```bash
   cd Image_Color_Analyzer
   ```

**(Optional)** Configure the `docker-compose.yaml` file and the `.env` file:
- In the `docker-compose.yaml`, set the environment variables in the `db` service. Example:
 ```yaml
 environment:
   POSTGRES_PASSWORD: example_password
   POSTGRES_USER: postgres
   POSTGRES_DB: postgres
 ```
- In the `.env` file, make sure that:
 - The `DBNAME` variable matches the `POSTGRES_DB` variable in the `docker-compose.yaml`.
 - The `PASSWORD` variable matches the `POSTGRES_PASSWORD` variable in the `docker-compose.yaml`.
 - The `USER` variable matches the `POSTGRES_USER` variable in the `docker-compose.yaml`.
 - The `SECRET_KEY` variable is replaced with a secret key of your choice.
 - The `HOST` variable is **NOT** changed.
- The `PYTHONUNBUFFERED` variable is **NOT** changed.

Example:
```txt
PYTHONUNBUFFERED=1
DBNAME=postgres
PASSWORD=example_password
SECRET_KEY=your_secret_key
USER=postgres
HOST=db
```
5. Build and start the Docker containers using Docker Compose:
   
   ```bash
   docker-compose up --build
   ```
   
   This command will set up the `PostgreSQL database`, the `Flask backend`, and the `Angular frontend` in separate containers.

6. Once the containers are up and running, open your web browser and go to `http://localhost:80` to access the `Image Color Analyzer` app.

---

## Usage

1. Register an account and log in.
2. Upload an image for color analysis.
3. View color analysis results, including the top colors with hex, and RGB codes.

---

## Contributing
- Contributions are welcome! 
- If you find any issues or have suggestions for improvements, feel free to `open an issue` or `submit a pull request`.

---

## License
- This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
