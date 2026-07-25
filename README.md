# 🚀 Full Stack Portfolio

A modern Full Stack Portfolio Application built using React, Flask, and MySQL. This project showcases personal information, projects, skills, and provides a contact form with data storage in a MySQL database.

---

## 📋 Prerequisites

Before running the project, ensure the following software is installed:

- Python 3.10+
- Node.js and npm
- XAMPP (MySQL)
- Git
- Visual Studio Code (Recommended)

---

## ⚙️ Database Setup

1. Open **XAMPP Control Panel**.
2. Start the **MySQL** service.
3. Verify that MySQL is running on **Port 3306**.
4. Create the required database if it does not already exist.
5. Update database credentials in the backend configuration if necessary.

---

## ▶️ Running the Backend

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

### Activate Virtual Environment

```bash
.\venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Start Flask Server

```bash
python app.py
```

The backend server will be available at:

```text
http://127.0.0.1:5000
```

Keep this terminal running while using the application.

---

## 🌐 Running the Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The frontend application will be available at:

```text
http://localhost:5173
```

Open the URL in your browser to view the portfolio.

---

## 🗄️ Viewing Database Records

To view stored database records:

```bash
cd backend
python view_db.py
```

This script displays the current records stored in the database.

---

## 📁 Project Structure

```text
full-stack-portfolio/
│
├── backend/
│   ├── app.py
│   ├── view_db.py
│   ├── requirements.txt
│   └── venv/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🛠️ Technology Stack

### Frontend
- React.js
- Vite
- HTML5
- CSS3
- JavaScript

### Backend
- Flask
- Python

### Database
- MySQL

### Development Tools
- Git & GitHub
- Visual Studio Code
- XAMPP

---

## 🔧 Troubleshooting

### MySQL Connection Error

- Ensure MySQL is running in XAMPP.
- Verify database credentials.
- Confirm port 3306 is not being used by another application.

### Backend Issues

```bash
pip install -r requirements.txt
```

Reinstall dependencies if required.

### Frontend Issues

```bash
npm install
npm run dev
```

Ensure Node.js is properly installed.

---

## 📄 License

This project is intended for educational and portfolio purposes.

---

⭐ If you find this project useful, consider giving it a star on GitHub.
