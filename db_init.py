import os
import pymysql
from dotenv import load_dotenv

# Load env variables
load_dotenv()

DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
DB_PORT = os.getenv('DB_PORT', '3306')
DB_NAME = os.getenv('DB_NAME', 'portfolio_db')

def create_database():
    print(f"Connecting to MySQL server at {DB_HOST}:{DB_PORT} as '{DB_USER}'...")
    try:
        # Connect to MySQL server without selecting database
        conn = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            port=int(DB_PORT)
        )
        
        with conn.cursor() as cursor:
            # Create database if it does not exist
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
            print(f"Database '{DB_NAME}' verified/created successfully.")
            
        conn.close()
        return True
    except Exception as e:
        print(f"Error connecting to MySQL or creating database: {e}")
        print("Please verify that your MySQL server is running and database credentials are correct.")
        return False

def seed_database():
    from app import app
    from models import db, Skill, Project

    # Initial Skills data
    skills_data = [
        # Frontend
        Skill(name='React', category='frontend', icon_class='fa-brands fa-react', proficiency=90),
        Skill(name='JavaScript', category='frontend', icon_class='fa-brands fa-js-square', proficiency=95),
        Skill(name='HTML5', category='frontend', icon_class='fa-brands fa-html5', proficiency=95),
        Skill(name='CSS3', category='frontend', icon_class='fa-brands fa-css3-alt', proficiency=90),
        
        # Backend
        Skill(name='Python', category='backend', icon_class='fa-brands fa-python', proficiency=90),
        Skill(name='Node.js', category='backend', icon_class='fa-brands fa-node-js', proficiency=80),
        Skill(name='MySQL', category='backend', icon_class='fa-solid fa-database', proficiency=85),
        Skill(name='MongoDB', category='backend', icon_class='fa-solid fa-leaf', proficiency=80),
        Skill(name='Django', category='backend', icon_class='fa-solid fa-server', proficiency=80)
    ]

    # Initial Projects data
    projects_data = [
        Project(
            title='DevConnect Platform',
            category='fullstack',
            tags='React, NodeJS, Express, MongoDB, Socket.io',
            image_name='devconnect.png',
            description='DevConnect is an end-to-end community and real-time co-working hub targeting distributed engineering departments. The software allows developers to boot instant sandboxed compilers directly in their browsers, synchronize documents, and jump into visual canvas workflows or live audio channels directly.',
            features='Secure sandboxed JavaScript and Python web execution shell|Real-time collaborative text editor using operational transformation|Audio/Video calling pipelines structured via WebRTC mesh networks|Comprehensive user profiles with automated repository integration',
            live_url='https://github.com',
            github_url='https://github.com'
        ),
        Project(
            title='PayWise Subscription Engine',
            category='fullstack',
            tags='NextJS, FastAPI, PostgreSQL, Stripe, Redis',
            image_name='paywise.png',
            description='PayWise is a business-to-business subscription lifecycle dashboard that helps SaaS providers capture client accounts, manage invoices, configure tier permissions, and chart key growth statistics (MRR, churn, LTV) in real-time. Integrated with advanced webhook logic and stripe components.',
            features='Modular payment gateways handling multi-currency subscriptions and invoicing|Extensive analytical chart dashboards populated by background queue aggregate jobs|Robust secure webhooks engine processing Stripe alerts with linear-backoff retry policies|Fine-grained tenant isolation policies implemented at the database tier',
            live_url='https://github.com',
            github_url='https://github.com'
        ),
        Project(
            title='CryptoSphere Dashboard',
            category='frontend',
            tags='React, TailwindCSS, Chart.js, Framer Motion',
            image_name='cryptosphere.png',
            description='CryptoSphere aggregates dozens of currency tokens, tracking live candlesticks, depth graphs, and trading values. By streaming WebSocket sockets from exchange API nodes, users can set up visual watchlists, configure price alerts, and follow trading patterns without delay.',
            features='High-density charts render millions of price ticks cleanly with canvas-backed drawing mechanisms|Real-time network connection monitoring showing frame drop latency metrics|Client-side state filters caching complex sorting parameters in indexedDB|Responsive layout scaling down to mobile viewports with fluid layout adjustments',
            live_url='https://github.com',
            github_url='https://github.com'
        )
    ]

    with app.app_context():
        print("Creating tables in database...")
        db.create_all()
        
        # Check and seed Skills
        if Skill.query.count() == 0:
            print("Seeding skills tables...")
            db.session.bulk_save_objects(skills_data)
            db.session.commit()
            print(f"Added {len(skills_data)} skills.")
        else:
            print("Skills table already contains records. Skipping seed.")

        # Check and seed Projects
        if Project.query.count() == 0:
            print("Seeding projects tables...")
            db.session.bulk_save_objects(projects_data)
            db.session.commit()
            print(f"Added {len(projects_data)} projects.")
        else:
            print("Projects table already contains records. Skipping seed.")

        print("Database schema initialization and seed process completed successfully!")

if __name__ == '__main__':
    # If a database connection string is provided, skip root server connection and seed directly.
    if os.getenv('DATABASE_URL'):
        print("DATABASE_URL detected. Skipping database creation step and running seed/migration directly...")
        seed_database()
    else:
        # Local configuration flow
        if create_database():
            seed_database()
        else:
            print("Database creation failed or was skipped. Attempting to seed tables anyway...")
            try:
                seed_database()
            except Exception as err:
                print(f"Error seeding database: {err}")

