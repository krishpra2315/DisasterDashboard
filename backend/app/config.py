import os

class Config:
    #MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://kvem56:81Sb4PLfku54S8He@clusterweatherapi.qxbok.mongodb.net/weather_db?retryWrites=true&w=majority&appName=ClusterWeatherAPI')
    API_URL = os.getenv('API_URL', 'https://www.ncei.noaa.gov/cdo-web/api/v2/data')
    API_KEY = os.getenv('API_KEY', 'yCuKPnKHqqhlWdXqmaCLTaSsizVUbHAx')