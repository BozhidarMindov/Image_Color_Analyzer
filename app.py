import json
import os
from datetime import datetime

from PIL import Image
from flask import Flask, render_template, request, jsonify
from analyzer import ImageColorAnalyzer
from flask_cors import CORS
import psycopg2
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")
# Set the JWT access token expiration time to 1 hour (3600 seconds)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600  # 1 hour in seconds

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


def get_current_time_isoformat():
    # Get the current time in UTC
    current_time_utc = datetime.utcnow()

    # Format the time in ISO 8601 format
    return current_time_utc.isoformat()


def get_image_size(image_path):
    # Open the image with Pillow
    with Image.open(image_path) as img:
        image_width, image_height = img.size

        return int(image_width), int(image_height)


def save_image_to_local_storage(image, image_title):
    # Save the image to a temporary location
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_title)
    image.save(image_path)

    return image_path


def save_image_to_db(image_url, title, width, height):
    # SQL query to insert data into the images table
    insert_query = "INSERT INTO images (image_url, title, width, height) VALUES (%s, %s, %s, %s) RETURNING id;"

    # Execute the query with the data as a tuple
    cursor.execute(insert_query, (image_url, title, width, height))
    conn.commit()

    # Retrieve the id value of the newly inserted row
    inserted_id = cursor.fetchone()[0]
    return inserted_id


def save_image_analysis_to_db(image_id, color_codes, frequencies, timestamp, user_id, identifier):
    # SQL query to insert data into the images table
    insert_query = "INSERT INTO image_analyses (image_id, color_codes, frequencies, timestamp, user_id, identifier) VALUES (%s, %s, %s, %s, %s, %s)"
    # Execute the query with the data as a tuple
    cursor.execute(insert_query, (image_id, color_codes, frequencies, timestamp, user_id, identifier))
    conn.commit()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/colors', methods=['GET', 'POST'])
@jwt_required()
def analyze_colors():
    current_user = get_jwt_identity()
    if not current_user:
        return jsonify(None), 401

    if request.method == 'POST':
        # Get the uploaded image file
        image = request.files['image']
        num_of_colors = int(request.form["numColors"])

        image_title = image.filename
        image_path = save_image_to_local_storage(image=image, image_title=image_title)
        img_width, img_height = get_image_size(image_path)

        # Create the image URL
        image_url = request.host_url + 'static/uploads/' + image_title

        # Save the image to the database
        image_id = save_image_to_db(image_url=image_url,
                                    title=image_title,
                                    width=img_width,
                                    height=img_height)

        # Perform color analysis on the image
        analyzer = ImageColorAnalyzer(image_path, num_of_colors)
        top_colors, frequency_of_colors = analyzer.analyze_colors()

        frequencies = [{'frequency': str(frequency)} for frequency in frequency_of_colors]
        color_codes = [{'color': str(color)} for color in top_colors]

        identifier = f"{image_id}_{image_title}"
        # Save the image_analysis to the database
        save_image_analysis_to_db(image_id=image_id,
                                  color_codes=json.dumps(color_codes),
                                  frequencies=json.dumps(frequencies),
                                  timestamp=get_current_time_isoformat(),
                                  user_id=current_user,
                                  identifier=identifier)

        # Combine the data into a single list of dictionaries
        color_data = [{'color': color["color"], 'frequency': str(frequency["frequency"])} for color, frequency in
                      zip(color_codes, frequencies)]

        # Return the color data and image URL
        return jsonify({'colorData': color_data,
                        'imageUrl': image_url,
                        'imageIdentifier': identifier
                        })


@app.route('/api/user_color_results', methods=['GET'])
@jwt_required()
def get_user_color_results_data():
    current_user = get_jwt_identity()
    if not current_user:
        return jsonify(None), 401

    if request.method == 'GET':
        query = """
                    SELECT ia.id, ia.image_id, ia.color_codes, ia.frequencies, ia.identifier, ia.timestamp, i.image_url
                    FROM image_analyses ia
                    JOIN images i ON ia.image_id = i.id
                    WHERE ia.user_id = %s;
                """

        # Execute the query with the user_id as a parameter
        cursor.execute(query, (current_user,))

        # Fetch all rows as a list of dictionaries
        result = cursor.fetchall()

        user_color_result_data = []
        for item in result:
            user_color_result_data.append({
                "imageUrl": item[6],
                "imageIdentifier": item[4]
            })

        return jsonify(user_color_result_data)


@app.route('/api/user_color_analysis/<image_identifier>', methods=['GET'])
@jwt_required()
def get_color_analysis(image_identifier):
    current_user = get_jwt_identity()
    if not current_user:
        return jsonify(None), 401

    query = """
        SELECT ia.id, ia.image_id, ia.color_codes, ia.frequencies, ia.timestamp, ia.identifier, i.image_url
        FROM image_analyses ia
        JOIN images i ON ia.image_id = i.id
        WHERE ia.user_id = %s AND ia.identifier = %s;
    """

    cursor.execute(query, (current_user, image_identifier))

    result = cursor.fetchone()

    # Combine the data into a single list of dictionaries
    color_data = [{'color': color["color"], 'frequency': str(frequency["frequency"])} for color, frequency in
                  zip(result[2], result[3])]

    return jsonify({"colorData": color_data,
                    "imageUrl": result[6]})


@app.route('/api/user_color_analysis/<image_identifier>', methods=['DELETE'])
@jwt_required()
def delete_color_analysis(image_identifier):
    current_user = get_jwt_identity()
    if not current_user:
        return jsonify(None), 401

    # Delete the color analysis associated with the given image_identifier and current user
    delete_query = """
        DELETE FROM image_analyses
        WHERE user_id = %s AND identifier = %s
        RETURNING image_id;
    """
    cursor.execute(delete_query, (current_user, image_identifier))
    deleted_row = cursor.fetchone()

    if deleted_row is None:
        return jsonify({'message': 'Color analysis not found'}), 404

    # Fetch the image_id of the deleted row
    image_id = deleted_row[0]

    # Delete the related image from the images table
    delete_image_query = """
        DELETE FROM images
        WHERE id = %s;
    """
    cursor.execute(delete_image_query, (image_id,))

    conn.commit()

    return jsonify({'message': 'Color analysis and related image deleted successfully'}), 200


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
    email = data['email']
    password = data['password']

    # Retrieve the user from the database
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user and bcrypt.check_password_hash(user[3], password):
        # Generate an access token using Flask-JWT-Extended
        access_token = create_access_token(identity=user[0])
        return jsonify({'access_token': access_token})
    else:
        return jsonify({'message': 'Invalid username or password'}), 409


@app.route('/api/is-logged-in', methods=['GET'])
@jwt_required()
def is_logged_in():
    current_user = get_jwt_identity()
    if current_user:
        return jsonify({'loggedIn': True}), 200
    else:
        return jsonify({'loggedIn': False}), 401


@app.route('/api/get-user-info', methods=['GET'])
@jwt_required()
def get_user_info():
    current_user_id = get_jwt_identity()
    if current_user_id:
        # Retrieve the user from the database
        cursor.execute("SELECT * FROM users WHERE id = %s", (current_user_id,))
        user = cursor.fetchone()
        if user:
            return jsonify({'user_info': {
                "email": user[1],
                "username": user[2]
            }}), 200
        else:
            return jsonify({'user_info': None}), 401
    else:
        return jsonify({'user_info': None}), 401


if __name__ == '__main__':
    app.run(debug=True)
