import os

class Config:
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://kvem56:r1z7zYYAJCOGUoqf@clusterweatherapi.qxbok.mongodb.net/weather_db?retryWrites=true&w=majority&appName=ClusterWeatherAPI')