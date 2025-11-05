const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// File paths
const USERS_FILE = path.join(__dirname, 'src/assets/users.json');
const PRODUCTS_FILE = path.join(__dirname, 'src/assets/products.json');
const ORDERS_FILE = path.join(__dirname, 'src/assets/orders.json');

// Helper functions
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Data written to ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
    return false;
  }
};

// ============ USERS ROUTES ============

// Get all users
app.get('/api/users', (req, res) => {
  const users = readJsonFile(USERS_FILE);
  res.json(users);
});

// Add new user (Signup)
app.post('/api/users', (req, res) => {
  const users = readJsonFile(USERS_FILE);
  const newUser = req.body;
  
  // Check if email exists
  if (users.some(u => u.email === newUser.email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  // Generate ID
  const newId = users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1;
  newUser.id = newId;
  
  users.push(newUser);
  
  if (writeJsonFile(USERS_FILE, users)) {
    res.status(201).json({ success: true, user: newUser });
  } else {
    res.status(500).json({ error: 'Failed to save user' });
  }
});

// ============ PRODUCTS ROUTES ============

// Get all products
app.get('/api/products', (req, res) => {
  const products = readJsonFile(PRODUCTS_FILE);
  res.json(products);
});

// Add new product
app.post('/api/products', (req, res) => {
  const products = readJsonFile(PRODUCTS_FILE);
  const newProduct = req.body;
  
  // Generate ID
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  newProduct.id = newId;
  
  products.push(newProduct);
  
  if (writeJsonFile(PRODUCTS_FILE, products)) {
    console.log('✅ Product added:', newProduct);
    res.status(201).json({ success: true, product: newProduct });
  } else {
    res.status(500).json({ error: 'Failed to save product' });
  }
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const products = readJsonFile(PRODUCTS_FILE);
  const productId = parseInt(req.params.id);
  const updatedProduct = req.body;
  
  const index = products.findIndex(p => p.id === productId);
  
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct, id: productId };
    
    if (writeJsonFile(PRODUCTS_FILE, products)) {
      console.log('✅ Product updated:', products[index]);
      res.json({ success: true, product: products[index] });
    } else {
      res.status(500).json({ error: 'Failed to update product' });
    }
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const products = readJsonFile(PRODUCTS_FILE);
  const productId = parseInt(req.params.id);
  
  const filteredProducts = products.filter(p => p.id !== productId);
  
  if (filteredProducts.length < products.length) {
    if (writeJsonFile(PRODUCTS_FILE, filteredProducts)) {
      console.log('✅ Product deleted:', productId);
      res.json({ success: true, message: 'Product deleted' });
    } else {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// ============ ORDERS ROUTES ============

// Get all orders
app.get('/api/orders', (req, res) => {
  const orders = readJsonFile(ORDERS_FILE);
  res.json(orders);
});

// Add new order
app.post('/api/orders', (req, res) => {
  console.log('📦 Received order request:', req.body);
  
  const orders = readJsonFile(ORDERS_FILE);
  const newOrder = req.body;
  
  // Validate order data
  if (!newOrder || !newOrder.userId) {
    console.error('❌ Invalid order data');
    return res.status(400).json({ error: 'Invalid order data' });
  }
  
  // Generate ID
  const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id || 0)) + 1 : 1;
  newOrder.id = newId;
  
  // Add timestamp if not present
  if (!newOrder.date) {
    newOrder.date = new Date().toISOString();
  }
  
  orders.push(newOrder);
  
  if (writeJsonFile(ORDERS_FILE, orders)) {
    console.log('✅ Order saved successfully:', newOrder);
    console.log(`📊 Total orders in database: ${orders.length}`);
    res.status(201).json({ success: true, order: newOrder });
  } else {
    console.error('❌ Failed to write order to file');
    res.status(500).json({ error: 'Failed to save order' });
  }
});

// Test endpoint to verify server is running
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders'
    }
  });
});

// ============ SERVER START ============

app.listen(PORT, () => {
  console.log('🚀 ========================================');
  console.log('🚀 SipStop Backend Server is running!');
  console.log('🚀 ========================================');
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📝 Users API: http://localhost:${PORT}/api/users`);
  console.log(`🍷 Products API: http://localhost:${PORT}/api/products`);
  console.log(`📦 Orders API: http://localhost:${PORT}/api/orders`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log('🚀 ========================================');
  console.log('✅ Server is ready to accept requests!');
  console.log('💾 All changes will be saved to JSON files');
  console.log('🚀 ========================================');
  
  // Log current data counts
  const users = readJsonFile(USERS_FILE);
  const products = readJsonFile(PRODUCTS_FILE);
  const orders = readJsonFile(ORDERS_FILE);
  console.log(`📊 Current Database Status:`);
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Products: ${products.length}`);
  console.log(`   - Orders: ${orders.length}`);
  console.log('🚀 ========================================\n');
});


