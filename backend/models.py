from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Skill(db.Model):
    __tablename__ = 'skills'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # frontend, backend, devops
    icon_class = db.Column(db.String(100), nullable=False)  # FontAwesome class name
    proficiency = db.Column(db.Integer, default=80)  # percentage value

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'icon_class': self.icon_class,
            'proficiency': self.proficiency
        }


class Project(db.Model):
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # fullstack, frontend, backend
    tags = db.Column(db.String(255), nullable=False)  # comma separated list
    image_name = db.Column(db.String(150), default='default.png')
    description = db.Column(db.Text, nullable=False)
    features = db.Column(db.Text, nullable=True)  # pipe '|' separated list of points
    live_url = db.Column(db.String(255), nullable=True)
    github_url = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'tags': self.tags,
            'image_name': self.image_name,
            'description': self.description,
            'features': self.features,
            'live_url': self.live_url,
            'github_url': self.github_url
        }


class Message(db.Model):
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'subject': self.subject,
            'message': self.message,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
