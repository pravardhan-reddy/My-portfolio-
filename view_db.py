import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from models import db, Message, Skill, Project

with app.app_context():
    print("\n" + "="*50)
    print("             PORTFOLIO DATABASE DATA")
    print("="*50)

    # 1. Messages Table
    print("\n--- MESSAGES (Contact Submissions) ---")
    messages = Message.query.all()
    if not messages:
        print("No messages received yet.")
    for m in messages:
        print(f"ID: {m.id}")
        print(f"Name: {m.name}")
        print(f"Email: {m.email}")
        print(f"Subject: {m.subject}")
        print(f"Message: {m.message}")
        print(f"Received At: {m.created_at}")
        print("-"*30)

    # 2. Skills Table
    print("\n--- SKILLS ---")
    skills = Skill.query.all()
    if not skills:
        print("No skills seeded.")
    for s in skills:
        print(f"- [{s.id}] {s.name} | Category: {s.category} | Proficiency: {s.proficiency}%")

    # 3. Projects Table (Hidden from frontend, but present in DB)
    print("\n--- PROJECTS (Stored in DB) ---")
    projects = Project.query.all()
    if not projects:
        print("No projects stored.")
    for p in projects:
        print(f"- [{p.id}] {p.title} | Category: {p.category}")
    
    print("="*50 + "\n")
