from flask import Blueprint, render_template, jsonify
from pymongo import MongoClient
from app.config import Config

main = Blueprint('main', __name__)


@main.route('/', strict_slashes=False, methods=['GET', 'POST'])
def index():
    return render_template('index.html')

@main.route('/weather', strict_slashes=False, methods=['GET', 'POST'])
def weather():
    try:
        client = MongoClient(Config.MONGO_URI)
        db = client['weather_db']
        weather_collection = db['weather']
        print("Connected to MongoDB")
        weather_data = list(weather_collection.find())
        for data in weather_data:
            data['_id'] = str(data['_id'])  # Convert ObjectId to string for JSON serialization
        return jsonify(weather_data)
    except Exception as e:
        print(e)

    return "<p>i suck</p>"

    #return render_template('weather.html', weathers=list(weather_collection.find()))