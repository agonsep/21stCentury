const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const { initializeDatabase, seedDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 5001;
const prisma = new PrismaClient();

// Initialize database
initializeDatabase()
  .then(() => seedDatabase())
  .catch(err => console.error('Database initialization error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Node.js backend!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  try {
    const user = await prisma.user.create({
      data: { name, email }
    });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Product routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Transform data to match frontend expectations
    const transformedProducts = products.map(product => ({
      ...product,
      manufacturedIn: product.origin,
      neviEligible: Boolean(product.neviEligible),
      documents: product.documents ? JSON.parse(product.documents) : []
    }));
    
    res.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/manufacturers', async (req, res) => {
  try {
    const results = await prisma.product.findMany({
      select: { manufacturer: true },
      distinct: ['manufacturer'],
      orderBy: { manufacturer: 'asc' }
    });
    
    const manufacturers = results.map(result => result.manufacturer);
    res.json(manufacturers);
  } catch (error) {
    console.error('Error fetching manufacturers:', error);
    res.status(500).json({ error: 'Failed to fetch manufacturers' });
  }
});

app.get('/api/products/origins', async (req, res) => {
  try {
    const results = await prisma.product.findMany({
      select: { origin: true },
      distinct: ['origin'],
      where: { 
        origin: { 
          not: null 
        } 
      },
      orderBy: { origin: 'asc' }
    });
    
    const origins = results.map(result => result.origin);
    res.json(origins);
  } catch (error) {
    console.error('Error fetching origins:', error);
    res.status(500).json({ error: 'Failed to fetch origins' });
  }
});

app.get('/api/products/categories', async (req, res) => {
  try {
    const results = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category']
    });
    
    const categories = results.map(result => ({
      id: result.category.toLowerCase().replace(/\s+/g, ''),
      name: result.category,
      description: `${result.category} products`
    }));
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/products/category/:category', async (req, res) => {
  const { category } = req.params;
  
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          equals: category,
          mode: 'insensitive'
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const transformedProducts = products.map(product => ({
      ...product,
      manufacturedIn: product.origin,
      neviEligible: Boolean(product.neviEligible),
      documents: product.documents ? JSON.parse(product.documents) : []
    }));
    
    res.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  const { 
    category, 
    name, 
    cost, 
    currency, 
    rating, 
    manufacturer, 
    manufacturedIn, 
    efficiency, 
    lifetime, 
    maintenanceCost, 
    footprint, 
    neviEligible,
    documents,
    description 
  } = req.body;
  
  if (!category || !name || cost === undefined || !currency || !rating || !manufacturer) {
    return res.status(400).json({ 
      error: 'Category, name, cost, currency, rating, and manufacturer are required' 
    });
  }
  
  try {
    const product = await prisma.product.create({
      data: {
        category,
        name,
        cost: parseFloat(cost),
        currency,
        rating,
        manufacturer,
        origin: manufacturedIn,
        efficiency: efficiency ? parseFloat(efficiency) : null,
        lifetime: lifetime ? parseInt(lifetime) : null,
        maintenanceCost: maintenanceCost ? parseFloat(maintenanceCost) : null,
        footprint,
        neviEligible: Boolean(neviEligible),
        documents: JSON.stringify(documents || []),
        description
      }
    });
    
    const transformedProduct = {
      ...product,
      manufacturedIn: product.origin,
      neviEligible: Boolean(product.neviEligible),
      documents: product.documents ? JSON.parse(product.documents) : []
    };
    
    res.status(201).json(transformedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id);
  const { 
    category, 
    name, 
    cost, 
    currency, 
    rating, 
    manufacturer, 
    manufacturedIn, 
    efficiency, 
    lifetime, 
    maintenanceCost, 
    footprint, 
    neviEligible,
    documents,
    description 
  } = req.body;
  
  if (!category || !name || cost === undefined || !currency || !rating || !manufacturer) {
    return res.status(400).json({ 
      error: 'Category, name, cost, currency, rating, and manufacturer are required' 
    });
  }
  
  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        category,
        name,
        cost: parseFloat(cost),
        currency,
        rating,
        manufacturer,
        origin: manufacturedIn,
        efficiency: efficiency ? parseFloat(efficiency) : null,
        lifetime: lifetime ? parseInt(lifetime) : null,
        maintenanceCost: maintenanceCost ? parseFloat(maintenanceCost) : null,
        footprint,
        neviEligible: Boolean(neviEligible),
        documents: JSON.stringify(documents || []),
        description
      }
    });
    
    const transformedProduct = {
      ...product,
      manufacturedIn: product.origin,
      neviEligible: Boolean(product.neviEligible),
      documents: product.documents ? JSON.parse(product.documents) : []
    };
    
    res.json(transformedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id);
  
  try {
    await prisma.product.delete({
      where: { id: productId }
    });
    
    res.json({ message: 'Product deleted successfully', id: productId });
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const fs = require('fs');
  
  const buildPath = path.join(__dirname, '../frontend/build');
  console.log('Production mode: Serving static files from React build');
  console.log('Build path:', buildPath);
  console.log('Build directory exists:', fs.existsSync(buildPath));
  
  if (fs.existsSync(buildPath)) {
    console.log('Build directory contents:', fs.readdirSync(buildPath));
  }
  
  // Serve static files from the React app build directory
  app.use(express.static(buildPath));
  
  // Handle React routing, return all requests to React app (except API routes)
  app.get('*', (req, res) => {
    // Don't serve React app for API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    
    const indexPath = path.join(buildPath, 'index.html');
    console.log('Serving React app for route:', req.path);
    console.log('Index.html exists:', fs.existsSync(indexPath));
    
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: 'React app not built properly - index.html not found' });
    }
  });
} else {
  // 404 handler for development
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT. Graceful shutdown...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM. Graceful shutdown...');
  await prisma.$disconnect();
  process.exit(0);
});