-- Migration: Populate suggested_ingredient from existing recipe data
-- Date: 2026-02-10
-- Task: 1.2 - chore(db): seed suggested_ingredient from existing recipe data

-- ============================================
-- Extract and insert unique ingredient names
-- ============================================
-- This script parses the comma-separated ingredients from the recipe table
-- and populates the suggested_ingredient table for autocomplete functionality

-- Step 1: Parse ingredients and insert unique ones
-- Uses string_to_array to split on commas and regexp_split_to_table as alternative
-- Trims whitespace and filters out 'n/a', empty strings

INSERT INTO suggested_ingredient (name)
SELECT DISTINCT 
    TRIM(ingredient_name) AS name
FROM (
    -- Split comma-separated ingredients into individual rows
    SELECT 
        unnest(string_to_array(ingredients, ',')) AS ingredient_name
    FROM recipe
    WHERE 
        ingredients IS NOT NULL 
        AND ingredients != ''
        AND ingredients != 'n/a'
) AS parsed_ingredients
WHERE 
    TRIM(ingredient_name) != ''
    AND TRIM(ingredient_name) != 'n/a'
    AND LENGTH(TRIM(ingredient_name)) > 0
    AND LENGTH(TRIM(ingredient_name)) <= 100  -- Match the schema constraint
ON CONFLICT (name) DO NOTHING;  -- Ignore duplicates

-- ============================================
-- Post-migration cleanup notes
-- ============================================
-- MANUAL CLEANUP REQUIRED:
-- 
-- After running this migration, review the suggested_ingredient table for:
-- 1. Plural vs singular duplicates (e.g., "potato" vs "potatoes")
-- 2. Compound ingredients that should be split (e.g., "soy sauce" vs "soy" + "sauce")
-- 3. Ingredient variations (e.g., "chicken thighs" vs "chicken")
-- 4. Typos or inconsistent naming
--
-- Query to find potential duplicates:
-- SELECT name FROM suggested_ingredient ORDER BY name;
--
-- Query to see ingredient frequency (helps prioritize cleanup):
-- SELECT 
--     TRIM(unnest(string_to_array(ingredients, ','))) AS ingredient,
--     COUNT(*) as frequency
-- FROM recipe 
-- WHERE ingredients IS NOT NULL AND ingredients != 'n/a'
-- GROUP BY TRIM(unnest(string_to_array(ingredients, ',')))
-- ORDER BY frequency DESC;

-- ============================================
-- Verification queries
-- ============================================

-- Count of suggested ingredients added
-- SELECT COUNT(*) as total_ingredients FROM suggested_ingredient;

-- View all suggested ingredients
-- SELECT name FROM suggested_ingredient ORDER BY name;
