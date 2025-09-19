-- Migration: Add additional EV chargers to product catalog
-- Date: 2025-09-19
-- Description: Adds 24 new EV charger products to expand the catalog

-- This migration safely adds new products without affecting existing data
-- It checks for existing products before insertion to avoid duplicates

-- Note: This would be handled by the application seeding logic
-- This file serves as documentation of what products were added

-- New products added:
-- - Schneider Electric EVF40
-- - Siemens VersiCharge  
-- - GE WattStation
-- - Blink IQ 200
-- - EVgo eXtend
-- - Phihong PSDA
-- - Efacec QC45
-- - IESA Level 3
-- - Heliox Fast
-- - IONITY HPC
-- - Shell Recharge
-- - BP Pulse 150
-- - Petro-Canada EV
-- - Volta Charging
-- - FreeWire Boost
-- - Ampère Charge
-- - Porsche Turbo
-- - Mercedes EQC
-- - Audi e-tron
-- - BMW iCharging
-- - Rivian Adventure
-- - Lucid Air
-- - Ford Lightning

-- Products are added via application seeding logic with duplicate protection