const sqlite3 = require('sqlite3').verbose();
const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'database.sqlite');

// Initialize database connections
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

const prisma = new PrismaClient();

// Create tables
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating users table:', err);
      });

      // Create products table
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category TEXT NOT NULL,
          name TEXT NOT NULL,
          cost REAL NOT NULL,
          currency TEXT DEFAULT 'USD',
          rating TEXT NOT NULL,
          manufacturer TEXT NOT NULL,
          origin TEXT,
          efficiency REAL,
          lifetime INTEGER,
          maintenance_cost REAL,
          footprint TEXT,
          nevi_eligible BOOLEAN DEFAULT 0,
          documents TEXT, -- JSON string for array of documents
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating products table:', err);
          reject(err);
        } else {
          console.log('Database tables initialized successfully');
          resolve();
        }
      });
    });
  });
};

// Seed initial data
const seedDatabase = async () => {
  try {
    // Check if data already exists
    const productCount = await prisma.product.count();
    
    if (productCount > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }

    console.log('Seeding database with initial data...');

    // Sample users
    const users = [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
      { name: 'Bob Johnson', email: 'bob@example.com' }
    ];

    // Insert users using Prisma
    await prisma.user.createMany({
      data: users
    });

    // Sample products (existing data)
    const products = [
        {
          category: "EV Charger",
          name: "ChargePoint CT4021",
          cost: 8500,
          currency: "USD",
          rating: "4.5/5",
          manufacturer: "ChargePoint",
          origin: "USA",
          efficiency: 96,
          lifetime: 15,
          maintenance_cost: 500,
          footprint: "Wall-mounted, 18\" x 12\" x 6\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Installation Manual", "Warranty", "NEVI Compliance Certificate"]),
          description: "Level 2 commercial EV charger with smart connectivity and energy management features."
        },
        {
          category: "EV Charger",
          name: "BTC Power 50kW DC Fast Charger",
          cost: 45000,
          currency: "USD", 
          rating: "4.2/5",
          manufacturer: "BTC Power",
          origin: "USA",
          efficiency: 94,
          lifetime: 12,
          maintenance_cost: 2000,
          footprint: "Floor-standing, 36\" x 24\" x 72\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Technical Specifications", "Installation Guide", "NEVI Documentation"]),
          description: "High-power DC fast charger suitable for highway corridors and commercial applications."
        },
        {
          category: "EV Charger",
          name: "ABB Terra 54 CJG",
          cost: 52000,
          currency: "USD",
          rating: "4.6/5", 
          manufacturer: "ABB",
          origin: "Finland",
          efficiency: 95,
          lifetime: 15,
          maintenance_cost: 1800,
          footprint: "Floor-standing, 32\" x 20\" x 68\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["User Manual", "Installation Manual", "Compliance Certificates"]),
          description: "Reliable DC fast charger with dual CCS connectors and advanced payment systems."
        },
        {
          category: "EV Charger",
          name: "Tesla Supercharger V3",
          cost: 65000,
          currency: "USD",
          rating: "4.8/5",
          manufacturer: "Tesla",
          origin: "USA", 
          efficiency: 97,
          lifetime: 20,
          maintenance_cost: 1200,
          footprint: "Floor-standing, 30\" x 18\" x 80\"",
          nevi_eligible: 0,
          documents: JSON.stringify(["Technical Manual", "Installation Guide"]),
          description: "High-speed DC charging with up to 250kW power delivery, optimized for Tesla vehicles."
        },
        {
          category: "EV Charger",
          name: "Electrify America 150kW",
          cost: 75000,
          currency: "USD",
          rating: "4.3/5",
          manufacturer: "Electrify America",
          origin: "USA",
          efficiency: 93,
          lifetime: 12,
          maintenance_cost: 2500,
          footprint: "Floor-standing, 38\" x 26\" x 78\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Installation Manual", "Maintenance Guide", "NEVI Compliance"]),
          description: "Ultra-fast charging station supporting multiple connector types for broad vehicle compatibility."
        },
        {
          category: "EV Charger", 
          name: "EVgo 100kW DC Fast Charger",
          cost: 58000,
          currency: "USD",
          rating: "4.1/5",
          manufacturer: "EVgo",
          origin: "USA",
          efficiency: 92,
          lifetime: 10,
          maintenance_cost: 2200,
          footprint: "Floor-standing, 34\" x 22\" x 74\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Technical Specs", "Installation Guide", "Warranty Information"]),
          description: "Fast charging solution designed for urban and suburban locations with reliable performance."
        },
        {
          category: "EV Charger",
          name: "Blink HQ 200",
          cost: 12000,
          currency: "USD", 
          rating: "3.8/5",
          manufacturer: "Blink Charging",
          origin: "USA",
          efficiency: 89,
          lifetime: 8,
          maintenance_cost: 800,
          footprint: "Pedestal-mounted, 24\" x 16\" x 60\"",
          nevi_eligible: 0,
          documents: JSON.stringify(["User Manual", "Installation Guide"]),
          description: "Level 2 charging station suitable for workplace and multi-family residential applications."
        },
        {
          category: "EV Charger",
          name: "Schneider Electric EVlink",
          cost: 15500,
          currency: "USD",
          rating: "4.4/5",
          manufacturer: "Schneider Electric",
          origin: "France",
          efficiency: 94,
          lifetime: 12,
          maintenance_cost: 600,
          footprint: "Wall-mounted, 20\" x 14\" x 8\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Installation Manual", "Technical Data", "Compliance Documentation"]),
          description: "Smart EV charging solution with energy management and grid integration capabilities."
        },
        {
          category: "EV Charger",
          name: "Siemens VersiCharge",
          cost: 9800,
          currency: "USD",
          rating: "4.2/5", 
          manufacturer: "Siemens",
          origin: "Germany",
          efficiency: 91,
          lifetime: 10,
          maintenance_cost: 450,
          footprint: "Wall-mounted, 16\" x 10\" x 5\"",
          nevi_eligible: 0,
          documents: JSON.stringify(["Installation Guide", "User Manual"]),
          description: "Compact Level 2 charger designed for residential and light commercial use."
        },
        {
          category: "EV Charger",
          name: "Webasto TurboDX",
          cost: 85000,
          currency: "USD",
          rating: "4.7/5",
          manufacturer: "Webasto",
          origin: "Germany",
          efficiency: 96,
          lifetime: 15,
          maintenance_cost: 3000,
          footprint: "Floor-standing, 40\" x 28\" x 82\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Technical Manual", "Installation Guide", "NEVI Certification"]),
          description: "High-power DC charging solution with advanced cooling and reliable performance."
        },
        {
          category: "EV Charger",
          name: "EVBOX Troniq 100", 
          cost: 62000,
          currency: "USD",
          rating: "4.3/5",
          manufacturer: "EVBox",
          origin: "Netherlands", 
          efficiency: 93,
          lifetime: 12,
          maintenance_cost: 2100,
          footprint: "Floor-standing, 35\" x 24\" x 76\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Installation Manual", "Maintenance Guide", "Technical Specs"]),
          description: "Fast charging station with modular design and comprehensive connectivity options."
        },
        {
          category: "EV Charger",
          name: "Delta Electronics 25kW",
          cost: 28000,
          currency: "USD",
          rating: "4.0/5",
          manufacturer: "Delta Electronics",
          origin: "Taiwan",
          efficiency: 90,
          lifetime: 8,
          maintenance_cost: 1200,
          footprint: "Wall-mounted, 28\" x 18\" x 12\"",
          nevi_eligible: 0,
          documents: JSON.stringify(["User Guide", "Installation Manual"]),
          description: "Mid-power DC charger suitable for fleet and commercial applications."
        },
        {
          category: "EV Charger",
          name: "Wallbox Pulsar Plus",
          cost: 7200,
          currency: "USD",
          rating: "4.5/5",
          manufacturer: "Wallbox",
          origin: "Spain",
          efficiency: 88,
          lifetime: 7,
          maintenance_cost: 300,
          footprint: "Wall-mounted, 14\" x 8\" x 4\"",
          nevi_eligible: 0,
          documents: JSON.stringify(["Installation Guide", "User Manual", "Warranty"]),
          description: "Smart home EV charger with WiFi connectivity and mobile app control."
        },
        {
          category: "EV Charger",
          name: "Tritium PK175",
          cost: 95000,
          currency: "USD",
          rating: "4.8/5",
          manufacturer: "Tritium",
          origin: "Australia", 
          efficiency: 98,
          lifetime: 18,
          maintenance_cost: 3500,
          footprint: "Floor-standing, 42\" x 30\" x 84\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Technical Documentation", "Installation Manual", "NEVI Compliance"]),
          description: "Ultra-high power charging system designed for highway corridors and high-utilization locations."
        },
        {
          category: "EV Charger",
          name: "Kempower Satellite",
          cost: 42000,
          currency: "USD",
          rating: "4.4/5",
          manufacturer: "Kempower",
          origin: "Finland",
          efficiency: 95,
          lifetime: 13,
          maintenance_cost: 1800,
          footprint: "Floor-standing, 33\" x 21\" x 70\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Installation Guide", "Technical Manual", "Compliance Docs"]),
          description: "Modular DC charging solution with flexible power distribution and scalable architecture."
        }
      ];

    // Insert products using Prisma
    await prisma.product.createMany({
      data: products.map(product => ({
        category: product.category,
        name: product.name,
        cost: product.cost,
        currency: product.currency,
        rating: product.rating,
        manufacturer: product.manufacturer,
        origin: product.origin,
        efficiency: product.efficiency,
        lifetime: product.lifetime,
        maintenanceCost: product.maintenance_cost,
        footprint: product.footprint,
        neviEligible: Boolean(product.nevi_eligible),
        documents: product.documents,
        description: product.description
      }))
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

module.exports = {
  db,
  initializeDatabase,
  seedDatabase
};