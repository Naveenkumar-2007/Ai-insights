from flask import Flask

app = Flask(__name__)
application = app  # For gunicorn

@app.route('/')
def home():
    return "AI Insights - Minimal Test - App is Running!"

@app.route('/health')
def health():
    return {"status": "healthy", "message": "Minimal Flask app is working"}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
