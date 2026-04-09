-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL
);

-- Logs table
CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    input TEXT,
    query TEXT,
    result TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_attack INTEGER DEFAULT 0
);

-- Seed users
INSERT INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin');
INSERT INTO users (username, password, role) VALUES ('john', 'pass123', 'user');
INSERT INTO users (username, password, role) VALUES ('jane', 'jane456', 'user');
INSERT INTO users (username, password, role) VALUES ('demo', 'demo', 'user');

-- Seed products
INSERT INTO products (name, description, price) VALUES ('Laptop', 'High-performance gaming laptop with RTX 4080', 1299.99);
INSERT INTO products (name, description, price) VALUES ('Smartphone', 'Latest flagship phone with 200MP camera', 899.99);
INSERT INTO products (name, description, price) VALUES ('Headphones', 'Noise-cancelling wireless headphones', 349.99);
INSERT INTO products (name, description, price) VALUES ('Tablet', '12.9 inch display with M2 chip', 1099.99);
INSERT INTO products (name, description, price) VALUES ('Smartwatch', 'Fitness tracking with heart rate monitor', 299.99);
INSERT INTO products (name, description, price) VALUES ('Keyboard', 'Mechanical RGB gaming keyboard', 159.99);
INSERT INTO products (name, description, price) VALUES ('Mouse', 'Wireless ergonomic mouse 16000 DPI', 79.99);
INSERT INTO products (name, description, price) VALUES ('Monitor', '4K 144Hz IPS display 27 inch', 599.99);
INSERT INTO products (name, description, price) VALUES ('SSD', '2TB NVMe solid state drive', 189.99);
INSERT INTO products (name, description, price) VALUES ('Webcam', '4K streaming webcam with auto-focus', 129.99);
