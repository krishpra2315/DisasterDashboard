from app import create_app

app = create_app()

port = 5000

if __name__ == '__main__':
    print("app running on port {}".format(port))
    app.run(debug=True, port=port)