import os
from flask import Flask, render_template, request, jsonify
from analyzer import ImageColorAnalyzer
from flask_cors import CORS
import psycopg2
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")

# Initialize Flask-Bcrypt and Flask-JWT-Extended
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Establish the database connection
conn = psycopg2.connect(dbname=os.environ.get("DBNAME"),
                        user=os.environ.get("USER"),
                        password=os.environ.get("PASSWORD"),
                        host="localhost",
                        port="5432")

cursor = conn.cursor()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/colors', methods=['GET', 'POST'])
def analyze_colors():
    if request.method == 'POST':
        # Get the uploaded image file
        image = request.files['image']
        num_of_colors = int(request.form["numColors"])

        # Save the image to a temporary location
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
        image.save(image_path)

        # Perform color analysis on the image
        analyzer = ImageColorAnalyzer(image_path, num_of_colors)
        top_colors, frequency_of_colors = analyzer.analyze_colors()

        # Combine the data into a single list of dictionaries
        color_data = [{'color': color, 'frequency': str(frequency)} for color, frequency in
                      zip(top_colors, frequency_of_colors)]

        # Create the image URL
        image_url = request.host_url + 'static/uploads/' + image.filename

        # Return the color data and image URL
        return jsonify({'colorData': color_data,
                        'imageUrl': image_url})


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = data['password']

    # Check if username exists
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    existing_username = cursor.fetchone()
    if existing_username:
        return jsonify({'message': 'Username is already taken. Please choose a different username or log in.'}), 409

    # Check if email exists
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    existing_email = cursor.fetchone()
    if existing_email:
        return jsonify({'message': 'Email is already registered. Please use a different email address or log in.'}), 409

    # Hash the password using Flask-Bcrypt
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Store the user in the database
    cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
                   (username, email, hashed_password))
    conn.commit()

    return jsonify({'message': 'User registered successfully'})


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    # Retrieve the user from the database
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()

    if user and bcrypt.check_password_hash(user[3], password):
        # Generate an access token using Flask-JWT-Extended
        access_token = create_access_token(identity=user[0])
        return jsonify({'access_token': access_token})
    else:
        return jsonify({'message': 'Invalid username or password'}), 409


if __name__ == '__main__':
    app.run(debug=True)
