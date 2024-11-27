from flask import Blueprint, render_template, jsonify
import csv
import os

from flask_cors import cross_origin

main = Blueprint('main', __name__)


@main.route('/', strict_slashes=False, methods=['GET', 'POST'])
def index():
    return render_template('index.html')

@main.route('/weather', strict_slashes=False, methods=['GET', 'POST'])
@cross_origin()
def weather():
    # Open the CSV file
    cwd = os.getcwd()
    with open('/Users/krishprasad/Desktop/Projects/DisasterDashboard/backend/storms.csv', mode='r') as file:
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
