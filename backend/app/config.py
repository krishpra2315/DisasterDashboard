import os

class Config:
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://kvem56:81Sb4PLfku54S8He@clusterweatherapi.qxbok.mongodb.net/weather_db?retryWrites=true&w=majority&appName=ClusterWeatherAPI')