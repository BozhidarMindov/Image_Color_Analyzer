import os

from PIL import Image
from flask import Flask, render_template, request, jsonify
from analyzer import ImageColorAnalyzer
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'static/uploads'


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/colors', methods=['GET', 'POST'])
def analyze_colors():
    if request.method == 'POST':
        # Get the uploaded image file
        image = request.files['image']

        # Save the image to a temporary location
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
        image.save(image_path)

        # Perform color analysis on the image
        analyzer = ImageColorAnalyzer(image_path)
        top_colors, frequency_of_colors = analyzer.analyze_colors()

        # Combine the data into a single list of dictionaries
        color_data = [{'color': color, 'frequency': str(frequency)} for color, frequency in
                      zip(top_colors, frequency_of_colors)]

        # Create the image URL
        image_url = request.host_url + 'static/uploads/' + image.filename

        # Return the color data and image URL
        return jsonify({'colorData': color_data,
                        'imageUrl': image_url})

    # return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
