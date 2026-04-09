const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('../config/config');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/logs', require('./routes/logs'));

// Page routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend/index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../frontend/login.html')));
app.get('/products', (req, res) => res.sendFile(path.join(__dirname, '../frontend/products.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, '../frontend/admin.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, '../frontend/dashboard.html')));

app.listen(config.PORT, () => {
  console.log(`\n🚀 SQL Injection Simulator running at http://localhost:${config.PORT}`);
  console.log(`📊 Dashboard: http://localhost:${config.PORT}/dashboard`);
  console.log(`👨‍💼 Admin Panel: http://localhost:${config.PORT}/admin\n`);
});
