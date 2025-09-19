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
    // Check if database already has data
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();

    if (userCount > 0 || productCount > 0) {
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

    // Insert users using upsert to avoid duplicates
    for (const user of users) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: user
      });
    }

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
        },
        {
          category: "EV Charger",
          name: "Schneider Electric EVF40",
          cost: 65000,
          currency: "USD",
          rating: "4.2/5",
          manufacturer: "Schneider Electric",
          origin: "France",
          efficiency: 92,
          lifetime: 15,
          maintenance_cost: 2400,
          footprint: "Floor-standing, 38\" x 26\" x 78\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Installation Manual", "Technical Specs", "NEVI Docs"]),
          description: "High-power DC charging station with integrated payment system and cloud connectivity."
        },
        {
          category: "EV Charger",
          name: "Siemens VersiCharge",
          cost: 55000,
          currency: "USD",
          rating: "4.1/5",
          manufacturer: "Siemens",
          origin: "Germany",
          efficiency: 91,
          lifetime: 14,
          maintenance_cost: 2200,
          footprint: "Floor-standing, 36\" x 24\" x 76\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["User Manual", "Installation Guide", "Certification"]),
          description: "Versatile DC fast charger with modular design and advanced diagnostics."
        },
        {
          category: "EV Charger",
          name: "GE WattStation",
          cost: 45000,
          currency: "USD",
          rating: "3.9/5",
          manufacturer: "General Electric",
          origin: "USA",
          efficiency: 89,
          lifetime: 12,
          maintenance_cost: 1900,
          footprint: "Floor-standing, 34\" x 22\" x 72\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Installation Manual", "Service Guide", "Warranty Info"]),
          description: "Reliable DC fast charging solution with proven industrial-grade components."
        },
        {
          category: "EV Charger",
          name: "Blink IQ 200",
          cost: 35000,
          currency: "USD",
          rating: "3.8/5",
          manufacturer: "Blink Charging",
          origin: "USA",
          efficiency: 87,
          lifetime: 10,
          maintenance_cost: 1600,
          footprint: "Floor-standing, 32\" x 20\" x 68\"",
          nevi_eligible: 0,
          documents: JSON.stringify(["User Guide", "Installation Manual", "Troubleshooting"]),
          description: "Network-connected DC charger with mobile app integration and remote monitoring."
        },
        {
          category: "EV Charger",
          name: "EVgo eXtend",
          cost: 72000,
          currency: "USD",
          rating: "4.6/5",
          manufacturer: "EVgo",
          origin: "USA",
          efficiency: 94,
          lifetime: 16,
          maintenance_cost: 2600,
          footprint: "Floor-standing, 40\" x 28\" x 80\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Technical Manual", "Installation Guide", "Network Specs"]),
          description: "High-power network charging station with dynamic load management and payment processing."
        },
        {
          category: "EV Charger",
          name: "Phihong PSDA",
          cost: 48000,
          currency: "USD",
          rating: "4.0/5",
          manufacturer: "Phihong",
          origin: "Taiwan",
          efficiency: 90,
          lifetime: 11,
          maintenance_cost: 1700,
          footprint: "Floor-standing, 35\" x 23\" x 74\"",
          nevi_eligible: 0,
          documents: JSON.stringify(["Installation Guide", "Service Manual", "Compliance"]),
          description: "Compact DC charging station with efficient power conversion and thermal management."
        },
        {
          category: "EV Charger",
          name: "Efacec QC45",
          cost: 58000,
          currency: "USD",
          rating: "4.3/5",
          manufacturer: "Efacec",
          origin: "Portugal",
          efficiency: 93,
          lifetime: 14,
          maintenance_cost: 2100,
          footprint: "Floor-standing, 37\" x 25\" x 77\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Technical Documentation", "Installation Manual", "NEVI Compliance"]),
          description: "Multi-standard DC fast charger with CHAdeMO and CCS connectors."
        },
        {
          category: "EV Charger",
          name: "IESA Level 3",
          cost: 52000,
          currency: "USD",
          rating: "3.7/5",
          manufacturer: "IESA",
          origin: "India",
          efficiency: 88,
          lifetime: 9,
          maintenance_cost: 1400,
          footprint: "Floor-standing, 33\" x 21\" x 70\"",
          nevi_eligible: 0,
          documents: JSON.stringify(["User Manual", "Installation Guide", "Maintenance Schedule"]),
          description: "Cost-effective DC charging solution for emerging markets with basic functionality."
        },
        {
          category: "EV Charger",
          name: "Heliox Fast",
          cost: 63000,
          currency: "USD",
          rating: "4.4/5",
          manufacturer: "Heliox",
          origin: "Netherlands",
          efficiency: 95,
          lifetime: 15,
          maintenance_cost: 2300,
          footprint: "Floor-standing, 39\" x 27\" x 79\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Installation Manual", "Technical Specs", "Fleet Integration"]),
          description: "High-power charging system optimized for bus and fleet applications."
        },
        {
          category: "EV Charger",
          name: "IONITY HPC",
          cost: 85000,
          currency: "USD",
          rating: "4.7/5",
          manufacturer: "IONITY",
          origin: "Germany",
          efficiency: 96,
          lifetime: 18,
          maintenance_cost: 3200,
          footprint: "Floor-standing, 42\" x 30\" x 82\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Technical Manual", "Installation Guide", "Network Protocol"]),
          description: "Ultra-high power charging solution for highway corridors with 350kW capability."
        },
        {
          category: "EV Charger",
          name: "Shell Recharge",
          cost: 67000,
          currency: "USD",
          rating: "4.2/5",
          manufacturer: "Shell",
          origin: "UK",
          efficiency: 92,
          lifetime: 14,
          maintenance_cost: 2400,
          footprint: "Floor-standing, 38\" x 26\" x 78\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Installation Guide", "Service Manual", "Brand Guidelines"]),
          description: "Integrated fuel station charging solution with payment and loyalty system integration."
        },
        {
          category: "EV Charger",
          name: "BP Pulse 150",
          cost: 71000,
          currency: "USD",
          rating: "4.5/5",
          manufacturer: "BP",
          origin: "UK",
          efficiency: 94,
          lifetime: 16,
          maintenance_cost: 2700,
          footprint: "Floor-standing, 40\" x 28\" x 80\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Technical Documentation", "Installation Manual", "Network Integration"]),
          description: "High-power charging solution with integrated renewable energy management."
        },
        {
          category: "EV Charger",
          name: "Petro-Canada EV",
          cost: 59000,
          currency: "USD",
          rating: "4.1/5",
          manufacturer: "Petro-Canada",
          origin: "Canada",
          efficiency: 91,
          lifetime: 13,
          maintenance_cost: 2000,
          footprint: "Floor-standing, 36\" x 24\" x 76\"",
          nevi_eligible: 0,
          documents: JSON.stringify(["Installation Manual", "Service Guide", "Canadian Standards"]),
          description: "Cold-weather optimized DC charger designed for Canadian climate conditions."
        },
        {
          category: "EV Charger",
          name: "Volta Charging",
          cost: 38000,
          currency: "USD",
          rating: "3.6/5",
          manufacturer: "Volta",
          origin: "USA",
          efficiency: 86,
          lifetime: 8,
          maintenance_cost: 1300,
          footprint: "Floor-standing, 31\" x 19\" x 66\"",
          nevi_eligible: 0,
          documents: JSON.stringify(["User Guide", "Installation Manual", "Advertising Specs"]),
          description: "Media-enabled charging station with integrated digital advertising displays."
        },
        {
          category: "EV Charger",
          name: "FreeWire Boost",
          cost: 82000,
          currency: "USD",
          rating: "4.8/5",
          manufacturer: "FreeWire",
          origin: "USA",
          efficiency: 97,
          lifetime: 17,
          maintenance_cost: 2900,
          footprint: "Mobile unit, 72\" x 36\" x 84\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Technical Manual", "Deployment Guide", "Battery Management"]),
          description: "Battery-integrated mobile charging solution that can be deployed without grid upgrades."
        },
        {
          category: "EV Charger",
          name: "Ampère Charge",
          cost: 46000,
          currency: "USD",
          rating: "3.9/5",
          manufacturer: "Ampère",
          origin: "France",
          efficiency: 89,
          lifetime: 11,
          maintenance_cost: 1600,
          footprint: "Floor-standing, 34\" x 22\" x 72\"",
          nevi_eligible: 0,
          documents: JSON.stringify(["Installation Guide", "Service Manual", "EU Compliance"]),
          description: "European-standard DC charger with Type 2 and CCS compatibility."
        },
        {
          category: "EV Charger",
          name: "Porsche Turbo",
          cost: 95000,
          currency: "USD",
          rating: "4.9/5",
          manufacturer: "Porsche",
          origin: "Germany",
          efficiency: 98,
          lifetime: 20,
          maintenance_cost: 3800,
          footprint: "Floor-standing, 44\" x 32\" x 86\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Premium Installation Guide", "Technical Specs", "Brand Standards"]),
          description: "Ultra-premium high-power charging solution for luxury automotive applications."
        },
        {
          category: "EV Charger",
          name: "Mercedes EQC",
          cost: 78000,
          currency: "USD",
          rating: "4.6/5",
          manufacturer: "Mercedes-Benz",
          origin: "Germany",
          efficiency: 95,
          lifetime: 17,
          maintenance_cost: 2800,
          footprint: "Floor-standing, 41\" x 29\" x 81\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Installation Manual", "Brand Guidelines", "Premium Service"]),
          description: "Luxury brand charging station with premium materials and integrated customer experience."
        },
        {
          category: "EV Charger",
          name: "Audi e-tron",
          cost: 73000,
          currency: "USD",
          rating: "4.4/5",
          manufacturer: "Audi",
          origin: "Germany",
          efficiency: 94,
          lifetime: 16,
          maintenance_cost: 2600,
          footprint: "Floor-standing, 39\" x 27\" x 79\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Technical Documentation", "Installation Guide", "Quattro Network"]),
          description: "Premium charging solution with quattro network integration and luxury design."
        },
        {
          category: "EV Charger",
          name: "BMW iCharging",
          cost: 69000,
          currency: "USD",
          rating: "4.3/5",
          manufacturer: "BMW",
          origin: "Germany",
          efficiency: 93,
          lifetime: 15,
          maintenance_cost: 2400,
          footprint: "Floor-standing, 38\" x 26\" x 78\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Installation Manual", "i-Series Integration", "Service Guide"]),
          description: "Premium charging station designed for BMW i-series integration and dealer networks."
        },
        {
          category: "EV Charger",
          name: "Rivian Adventure",
          cost: 54000,
          currency: "USD",
          rating: "4.2/5",
          manufacturer: "Rivian",
          origin: "USA",
          efficiency: 91,
          lifetime: 12,
          maintenance_cost: 1900,
          footprint: "Floor-standing, 36\" x 24\" x 76\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Adventure Guide", "Installation Manual", "Off-Grid Specs"]),
          description: "Rugged charging solution designed for outdoor and adventure vehicle applications."
        },
        {
          category: "EV Charger",
          name: "Lucid Air",
          cost: 88000,
          currency: "USD",
          rating: "4.7/5",
          manufacturer: "Lucid Motors",
          origin: "USA",
          efficiency: 96,
          lifetime: 18,
          maintenance_cost: 3100,
          footprint: "Floor-standing, 42\" x 30\" x 82\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Technical Manual", "Luxury Installation", "Air Network"]),
          description: "Ultra-luxury high-efficiency charging solution with advanced thermal management."
        },
        {
          category: "EV Charger",
          name: "Ford Lightning",
          cost: 51000,
          currency: "USD",
          rating: "4.0/5",
          manufacturer: "Ford",
          origin: "USA",
          efficiency: 90,
          lifetime: 13,
          maintenance_cost: 1800,
          footprint: "Floor-standing, 35\" x 23\" x 74\"",
          nevi_eligible: 1,
          documents: JSON.stringify(["Installation Guide", "F-150 Integration", "BlueOval Network"]),
          description: "Commercial-grade charging solution optimized for Ford Lightning and fleet applications."
        }
      ];

    // Insert products safely - only add if they don't exist
    for (const product of products) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          name: product.name,
          manufacturer: product.manufacturer
        }
      });

      if (!existingProduct) {
        await prisma.product.create({
          data: {
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
          }
        });
      }
    }

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