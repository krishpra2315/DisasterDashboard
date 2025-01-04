from flask import Blueprint, jsonify, send_from_directory
import csv
import os

from flask_cors import cross_origin

bp = Blueprint('main', __name__)

@bp.route("/")
def serve():
    # Using absolute path for index.html
    dist_folder = os.path.join(os.getcwd(), 'backend', 'app', 'static', 'dist')
    print(dist_folder)
    return send_from_directory(dist_folder, "index.html")

@bp.route('/static/<path:filename>')
def serve_static(filename):
    # Using absolute path for static files
    dist_folder = os.path.join(os.getcwd(), 'backend', 'app', 'static', 'dist')
    return send_from_directory(dist_folder, filename)

@bp.route('/api/weather', strict_slashes=False, methods=['GET', 'POST'])
@cross_origin()
def weather():
    # Open the CSV file
    cwd = os.getcwd()
    with open('/app/backend/storms.csv', mode='r') as file:
        # Create a CSV reader
        reader = csv.reader(file)
        data = {}
        # Skip the header row
        header = next(reader)

        # Read each row in the CSV file
        for row in reader:
            title = row[1] + " (" + row[2] + ")"
            if title not in data:
                data[title] = [dict(zip(header, row))]
            else:
                data[title].append(dict(zip(header, row)))

    return jsonify(data)
