import numpy as np
from PIL import Image
import webcolors
from sklearn.cluster import KMeans


def resize_image(image):
    return image.resize((200, 200))


def convert_image_to_array(image):
    return np.array(image)


def flatten_image_array(image_array):
    return image_array.reshape(-1, image_array.shape[-1])


def calculate_color_frequencies(pixels):
    colors, counts = np.unique(pixels, axis=0, return_counts=True)
    return colors, counts


def get_top_colors(colors, counts, num_colors):
    sorted_indices = np.argsort(-counts)
    sorted_colors = colors[sorted_indices]
    sorted_counts = counts[sorted_indices]
    top_colors = sorted_colors[:num_colors]
    top_counts = sorted_counts[:num_colors]
    return top_colors, top_counts


def get_rgb_and_hex_colors(colors):
    rgb_colors = [tuple(int(color_value) for color_value in color[:3]) for color in colors]
    hex_colors = [webcolors.rgb_to_hex(color) for color in rgb_colors]

    return rgb_colors, hex_colors


class ImageColorAnalyzer:
    def __init__(self, image_path, num_of_colors):
        self.image_path = image_path
        self.num_of_colors = num_of_colors

    def analyze_colors(self):
        image = self.open_image()

        resized_image = resize_image(image)
        image_array = convert_image_to_array(resized_image)
        pixels = flatten_image_array(image_array)

        # Perform KMeans clustering
        kmeans = KMeans(n_clusters=10, random_state=None, n_init=10)
        kmeans.fit(pixels)
        colors = kmeans.cluster_centers_
        counts = np.bincount(kmeans.labels_)

        total_pixels = np.sum(counts)  # # Calculate the total number of pixels

        top_colors, top_counts = get_top_colors(colors, counts, self.num_of_colors)
        rgb_colors, hex_colors = get_rgb_and_hex_colors(top_colors)
        frequencies = np.round(top_counts / total_pixels, 3)  # Round frequencies to 2 decimal places
        # image.save(self.image_path)
        return hex_colors, rgb_colors, frequencies

    def open_image(self):
        return Image.open(self.image_path).convert("RGB")


