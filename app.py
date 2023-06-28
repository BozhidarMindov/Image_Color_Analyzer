import os
from flask import Flask, render_template, request
from analyzer import ImageColorAnalyzer

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Get the uploaded image file
        image = request.files['image']

        # Save the image to a temporary location
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
        image.save(image_path)

        # Perform color analysis on the image
        analyzer = ImageColorAnalyzer(image_path)
        top_colors, frequency_of_colors = analyzer.analyze_colors()

        # Combine the data into a single list of tuples
        color_data = list(zip(top_colors, frequency_of_colors))

        # Render the results template with the analyzed colors
        return render_template('index.html', image_path=image_path, color_data=color_data)

    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
