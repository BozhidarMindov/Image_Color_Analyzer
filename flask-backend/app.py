import json
import os
from datetime import datetime
from io import BytesIO

from PIL import Image
from flask import Flask, request, jsonify
from analyzer import ImageColorAnalyzer
from flask_cors import CORS
import psycopg2
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'flask-backend/static/uploads'
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


def check_if_file_is_an_image(image):
    try:
        image = Image.open(BytesIO(image.read()))
        return image
    except Exception as e:
        return None


def check_image_size(image):
    image.seek(0, os.SEEK_END)  # Move the file pointer to the end of the file
    file_size = image.tell()  # Get the current position of the file pointer (which is the size of the file in bytes)
    image.seek(0)  # Move the file pointer back to the beginning of the file

    # Check if the image size exceeds the limit (10 MB)
    max_file_size_bytes = 10 * 1024 * 1024  # 10 MB in bytes
    limit = "10 MB"
    if file_size > max_file_size_bytes:
        return {'message': f'Image size exceeds the limit ({limit})!'}

    return None


def save_image_to_local_storage(image, image_title):
    # Save the image to a temporary location
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_title)
    image.save(image_path)

    return image_path


def delete_image_from_local_storage(image_path):
    try:
        # Check if the file exists before attempting to delete it
        if os.path.exists(image_path):
            os.remove(image_path)
    except Exception as e:
        print("Error deleting image:", str(e))
        return False  # Failed to delete the image


def save_image_to_db(image_url, title, width, height):
    # SQL query to insert data into the images table
    insert_query = "INSERT INTO images (image_url, title, width, height) VALUES (%s, %s, %s, %s) RETURNING id;"

    # Execute the query with the data as a tuple
    cursor.execute(insert_query, (image_url, title, width, height))
    conn.commit()

    # Retrieve the id value of the newly inserted row
    inserted_id = cursor.fetchone()[0]
    return inserted_id


def save_image_analysis_to_db(image_id, hex_color_codes, rgb_color_codes, frequencies, timestamp, user_id, identifier):
    # SQL query to insert data into the images table
    insert_query = "INSERT INTO image_analyses (image_id, hex_color_codes, rgb_color_codes, frequencies, timestamp, user_id, identifier) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    # Execute the query with the data as a tuple
    cursor.execute(insert_query, (image_id, hex_color_codes, rgb_color_codes, frequencies, timestamp, user_id, identifier))
    conn.commit()


@app.route('/api/colors', methods=['POST'])
@jwt_required()
def analyze_colors():
    current_user = get_jwt_identity()
    if not current_user:
        return jsonify(None), 401

    # Get the uploaded image file
    image = request.files['image']

    pil_image = check_if_file_is_an_image(image)
    if pil_image is None:
        return jsonify({'message': 'The file is not an image!'}), 400

    time_now = get_current_time_isoformat()

    # If the image is too large, it will not be saved and analyzed
    image_size_message = check_image_size(image)
    if image_size_message is not None:
        return jsonify(image_size_message), 400

    num_of_colors = int(request.form["numColors"])

    image_title = f"{str(time_now).replace(':', '-')}_{image.filename}"
    image_path = save_image_to_local_storage(image=image, image_title=image_title)
    img_width, img_height = pil_image.size

    # Create the image URL
    image_url = request.host_url + 'static/uploads/' + image_title

    # Save the image to the database
    image_id = save_image_to_db(image_url=image_url,
                                title=image_title,
                                width=img_width,
                                height=img_height)

    # Perform color analysis on the image
    analyzer = ImageColorAnalyzer(pil_image, num_of_colors)
    hex_colors, rgb_colors, frequency_of_colors = analyzer.analyze_colors()

    frequencies = [{'frequency': str(frequency)} for frequency in frequency_of_colors]
    hex_color_codes = [{'color': str(color)} for color in hex_colors]
    rgb_color_codes = [{'color': str(color)} for color in rgb_colors]

    identifier = f"{image_id}_{image_title}"
    # Save the image_analysis to the database
    save_image_analysis_to_db(image_id=image_id,
                              hex_color_codes=json.dumps(hex_color_codes),
                              rgb_color_codes=json.dumps(rgb_color_codes),
                              frequencies=json.dumps(frequencies),
                              timestamp=time_now,
                              user_id=current_user,
                              identifier=identifier)

    # Combine the data into a single list of dictionaries
    color_data = [{'hex_color': hex_color["color"],
                   'rgb_color': rgb_color["color"],
                   'frequency': str(frequency["frequency"])}
                  for hex_color, rgb_color, frequency in zip(hex_color_codes, rgb_color_codes, frequencies)]

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

    query = """
                SELECT ia.id, ia.image_id, ia.hex_color_codes, ia.rgb_color_codes, ia.frequencies, ia.identifier, ia.timestamp, i.image_url
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
            "imageUrl": item[7],
            "imageIdentifier": item[5]
        })

    return jsonify(user_color_result_data)


@app.route('/api/user_color_analysis/<image_identifier>', methods=['GET'])
@jwt_required()
def get_color_analysis(image_identifier):
    current_user = get_jwt_identity()
    if not current_user:
        return jsonify(None), 401

    query = """
        SELECT ia.id, ia.image_id, ia.hex_color_codes, ia.rgb_color_codes, ia.frequencies, ia.timestamp, ia.identifier, i.image_url
        FROM image_analyses ia
        JOIN images i ON ia.image_id = i.id
        WHERE ia.user_id = %s AND ia.identifier = %s;
    """

    cursor.execute(query, (current_user, image_identifier))

    result = cursor.fetchone()

    # Combine the data into a single list of dictionaries
    color_data = [{'hex_color': hex_color["color"],
                   'rgb_color': rgb_color["color"],
                   'frequency': str(frequency["frequency"])}
                  for hex_color, rgb_color, frequency in zip(result[2], result[3], result[4])]

    return jsonify({"colorData": color_data,
                    "imageUrl": result[7]})


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
        WHERE id = %s
        RETURNING image_url;
    """
    cursor.execute(delete_image_query, (image_id,))

    deleted_row_image = cursor.fetchone()
    if deleted_row_image is None:
        return jsonify({'message': 'Color analysis not found'}), 404
    conn.commit()

    # Delete the related image from the local storage
    image_url = deleted_row_image[0]
    split_url = image_url.split('/')
    delete_image_from_local_storage("/".join([split_url[3], split_url[4], split_url[5]]))

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
    if not current_user_id:
        return jsonify({'user_info': None}), 401

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


if __name__ == '__main__':
    app.run(debug=True)
