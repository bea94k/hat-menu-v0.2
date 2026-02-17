-- Migration: Add suggested_ingredient and recipe_ingredient tables
-- Date: 2026-02-10
-- Task: 1.1 - feat(db): add suggested_ingredient and recipe_ingredient tables

-- ============================================
-- Create suggested_ingredient table
-- ============================================
-- This table stores unique ingredient names for autocomplete suggestions
-- Populated from existing recipe ingredients and grows as users add new ingredients

CREATE TABLE IF NOT EXISTS suggested_ingredient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast autocomplete lookups
CREATE INDEX IF NOT EXISTS idx_suggested_ingredient_name ON suggested_ingredient(name);

-- ============================================
-- Create recipe_ingredient junction table
-- ============================================
-- This table stores structured ingredients for each recipe
-- Allows for quantity, unit, and ingredient name to be stored separately

CREATE TABLE IF NOT EXISTS recipe_ingredient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES recipe(id) ON DELETE CASCADE,
    ingredient_name TEXT NOT NULL,
    quantity NUMERIC(10,3), -- up to 10 digits total, 3 after decimal point
    unit TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_recipe_ingredient_recipe_id ON recipe_ingredient(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredient_name ON recipe_ingredient(ingredient_name);

-- ============================================
-- Add unit constraint (optional but recommended)
-- ============================================
-- Ensures only valid units are stored in the database
-- Matches the units array defined in hat-menu/src/schemas/Ingredients.ts

ALTER TABLE recipe_ingredient 
ADD CONSTRAINT check_valid_unit 
CHECK (unit IS NULL OR unit IN ('', 'g', 'ml', 'dl', 'tsp', 'tbsp', 'cup', 'piece', 'clove'));

-- ============================================
-- Comments for documentation
-- ============================================

COMMENT ON TABLE suggested_ingredient IS 'Stores unique ingredient names for autocomplete in recipe forms';
COMMENT ON TABLE recipe_ingredient IS 'Junction table storing structured ingredients (name, quantity, unit) for each recipe';
COMMENT ON COLUMN recipe_ingredient.ingredient_name IS 'Denormalized ingredient name - allows custom ingredients without foreign key constraint';
COMMENT ON COLUMN recipe_ingredient.quantity IS 'Ingredient quantity with up to 3 decimal places';
COMMENT ON COLUMN recipe_ingredient.unit IS 'Unit of measurement - validated against predefined list';
