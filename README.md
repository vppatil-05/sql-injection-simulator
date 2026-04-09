# 💉 SQL Injection Attack Simulator

An educational platform to learn, test, and understand SQL injection vulnerabilities.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Or with auto-reload
npm run dev
```

Open **http://localhost:3000** in your browser.

## 📁 Project Structure

```
sql-injection-simulator/
├── frontend/          # HTML/CSS/JS pages
│   ├── index.html     # Home page
│   ├── login.html     # Login (vulnerable/secure)
│   ├── products.html  # Product search
│   ├── admin.html     # Hidden admin panel
│   ├── dashboard.html # Attack analytics
│   ├── css/style.css
│   └── js/script.js
├── backend/
│   ├── server.js      # Express server
│   ├── routes/        # API routes
│   ├── controllers/   # Business logic
│   ├── models/        # Database models
│   └── middleware/     # Detector & logger
├── database/
│   └── schema.sql     # DB schema & seed data
└── config/config.js
```

## 🎯 Features

- **Vulnerable vs Secure Mode** toggle
- **Login injection** — bypass authentication
- **Product search injection** — dump all data
- **Real-time query viewer** — see executed SQL
- **Attack visualizer** — step-by-step breakdown
- **Auto attack button** — automated injection tests
- **Dashboard** — real-time attack analytics
- **Admin panel** — manage products
- **Detection system** — pattern-based SQL injection detection

## 💥 Example Injections

| Input | Effect |
|-------|--------|
| `' OR '1'='1` | Bypass login |
| `admin'--` | Comment out password check |
| `' OR role='admin'--` | Access as admin |
| `' OR 1=1 --` | Show all products |
| `' UNION SELECT * FROM users--` | Steal user data |

## ⚠️ Disclaimer

This tool is for **educational purposes only**. Never use SQL injection techniques on systems you don't own or have permission to test.
