import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from models import db, Skill, Project, Message

# Load env file
load_dotenv()

app = Flask(__name__)
# Enable CORS for frontend API consumption
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Database connection configuration (Checks DATABASE_URL first, fallbacks to individual variables)
DATABASE_URL = os.getenv('DATABASE_URL')

if DATABASE_URL:
    # Standardize connection string prefixes for SQLAlchemy compatibility
    if DATABASE_URL.startswith('postgres://'):
        DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql+psycopg2://', 1)
    elif DATABASE_URL.startswith('postgresql://'):
        DATABASE_URL = DATABASE_URL.replace('postgresql://', 'postgresql+psycopg2://', 1)
    elif DATABASE_URL.startswith('mysql://'):
        DATABASE_URL = DATABASE_URL.replace('mysql://', 'mysql+pymysql://', 1)
else:
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
    DB_PORT = os.getenv('DB_PORT', '3306')
    DB_NAME = os.getenv('DB_NAME', 'portfolio_db')
    db_password_clause = f":{DB_PASSWORD}" if DB_PASSWORD else ""
    DATABASE_URL = f"mysql+pymysql://{DB_USER}{db_password_clause}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'message': "Welcome to Sai Pravardhan Reddy Estati's Portfolio API Server",
        'status': 'healthy',
        'endpoints': {
            'health': '/api/health',
            'skills': '/api/skills',
            'projects': '/api/projects'
        }
    }), 200

# Test db connection status route
@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        # Check connection by running simple select query
        db.session.execute(db.text('SELECT 1'))
        return jsonify({'status': 'healthy', 'database': 'connected'}), 200
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'database': 'disconnected', 'error': str(e)}), 500

@app.route('/api/skills', methods=['GET'])
def get_skills():
    try:
        skills = Skill.query.all()
        return jsonify([skill.to_dict() for skill in skills]), 200
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve skills', 'details': str(e)}), 500

@app.route('/api/projects', methods=['GET'])
def get_projects():
    try:
        projects = Project.query.all()
        return jsonify([proj.to_dict() for proj in projects]), 200
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve projects', 'details': str(e)}), 500

@app.route('/api/contact', methods=['POST'])
def save_message():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid request body'}), 400
            
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        subject = data.get('subject', '').strip()
        message_body = data.get('message', '').strip()

        if not name or not email or not subject or not message_body:
            return jsonify({'error': 'All fields are required'}), 400

        new_message = Message(
            name=name,
            email=email,
            subject=subject,
            message=message_body
        )
        
        db.session.add(new_message)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Your query has been recorded. Thank you!'}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to record message', 'details': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
