import os
from flask import Flask, render_template, request
from analyzer import ImageColorAnalyzer

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/analyze', methods=['POST'])
def analyze():
    # Get the uploaded image file
    image = request.files['image']

    # Save the image to a temporary location
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
    image.save(image_path)

    # Perform color analysis on the image
    analyzer = ImageColorAnalyzer(image_path)
    top_colors, frequency_of_colors = analyzer.analyze_colors()

    # Render the results template with the analyzed colors
    return render_template('index.html', image_path=image_path, top_colors=top_colors, frequency_of_colors=frequency_of_colors)


if __name__ == '__main__':
    app.run()
