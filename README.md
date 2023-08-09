# Image_Color_Analyzer

The Image Color Analyzer is a web application that allows users to analyze images and view their top colors. Users can register, log in, and start using the app to upload images and see the color analysis results.

## Features

- User registration and authentication system
- Upload images for color analysis (images, image analyses and user information are stored in a database)
- View color analysis results for uploaded images

## Tech Stack

- Frontend: Angular 
- Backend: Flask (Python)
- Database: PostgreSQL

## Getting Started

To run the Image Color Analyzer project locally on your machine, follow these steps:

1. Make sure you have the following software installed:
   - Node.js and npm (for Angular)
   - Python (for Flask)
   - PostgreSQL (for the database)

2. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/BozhidarMindov/Image_Color_Analyzer.git
   ```
   
3. Navigate to the project root directory:

   ```bash
   cd Image_Color_Analyzer
   ```

4. Install frontend dependencies:
   
   ```bash
   cd angular-frontend
   npm install
   ```

5. Install backend dependencies:

   ```bash
   cd ../flask-backend
   pip install -r requirements.txt
   ```

6. Set up the database:
   - Create a `PostgreSQL` database for the project.
   - Update the database credentials in `flask-backend/app.py` with yours.

## Launching the app

To launch the app you have to do the following commands:

1. Start the `backend server` (assuming you are in the `root` directory):

   ```bash
   cd flask-backend
   python app.py
   ```

2. Start the `frontend development` server (assuming you are in the `backend` directory):

   ```bash
   cd ../angular-frontend
   ng serve
   ```

3. Open your web browser and go to `http://localhost:4200` to access the `Image Color Analyzer` app.

## Usage

1. Register an account and log in.
2. Upload an image for color analysis.
3. View color analysis results, including top colors, hex and RGB codes.

## Contributing
- Contributions are welcome! 
- If you find any issues or have suggestions for improvements, feel free to `open an issue` or `submit a pull request`.

## License
- currently not copyright free. Licence coming up soon.