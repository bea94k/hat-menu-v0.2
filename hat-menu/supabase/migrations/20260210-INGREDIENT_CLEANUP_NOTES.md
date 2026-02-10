# Ingredient Cleanup Notes

## Overview
After running the migration to populate `suggested_ingredient` from existing recipe data, manual cleanup is recommended to ensure consistent autocomplete suggestions.

## ✅ ESTABLISHED STANDARDS (Post-Cleanup)

After manual cleanup, the following conventions are now enforced:

### Naming Convention Rules
1. **Singular form**: All ingredients should be in singular form (e.g., "potato" not "potatoes")
2. **Lowercase**: All ingredients should be lowercase, even for origin-based names (e.g., "asian", "indian", not "Asian", "Indian")
   - Note: This applies regardless of grammatical correctness for consistency in autocomplete

### Examples of Standardization
- ✅ "potato" (not "potatoes")
- ✅ "mushroom" (not "mushrooms")
- ✅ "asian" (not "Asian")
- ✅ "indian" (not "Indian")

**When adding new ingredients, always follow these conventions.**

---

## Common Issues Addressed During Initial Cleanup

### 1. Plural vs Singular Forms
Examples from the data that were consolidated:
- "potato" vs "potatoes" → kept "potato"
- "mushroom" vs "mushrooms" → kept "mushroom"
- "bean" vs "beans" → kept "bean"

**Resolution**: Standardized to singular form.

### 2. Compound Ingredients
Some ingredients may be too specific or compound phrases:
- "kantarelli sauce" - keep as-is or split into "kantarelli" + "sauce"?
- "soy sauce" - keep as compound or split?
- "brown sauce" - compound ingredient
- "lemon juice" - compound ingredient
- "wok veggies" - very generic, might need refinement

**Action**: Keep compound ingredients that represent single items (e.g., "soy sauce"), but consider whether generic terms like "wok veggies" should be more specific.

### 3. Variations of the Same Ingredient
Examples:
- "chicken", "chicken thighs", "chicken wings", "fried chicken", "chicken file"
- "potato", "potatoes", "mashed potatoes", "baked potato", "potato wedges"
- "soup", "chicken soup", "mushroom soup", "spinach soup", "broccoli soup"
- "pasta", "fancy pasta"
- "rice", "rice noodles"

**Action**: Decide granularity level - should base ingredients (chicken, potato) be suggested separately from prepared/specific forms?

### 4. Dishes vs Ingredients
Some entries are prepared dishes rather than ingredients:
- "carbonara" (is a dish, not just an ingredient)
- "tacos" (could be shells or the full dish)
- "pizza" (dish, not ingredient)

**Action**: Remove or reclassify these items.

### 5. Non-English or Specific Brand Names
- "Kinkkukiusaus" (Finnish)
- "Makaronilaatikko" (Finnish)
- "tilli-kermaviilikastike" (Finnish)
- "kasvissosekeitto" (Finnish)
- "Lihapasteijat" (Finnish)
- "mifu" (specific product/brand)

**Action**: Keep if these are commonly used in your recipes, standardize spelling.

## Recommended SQL Queries

### Find all ingredients sorted alphabetically
```sql
SELECT name FROM suggested_ingredient ORDER BY name;
```

### Find ingredients that might be duplicates (similar names)
```sql
SELECT a.name, b.name 
FROM suggested_ingredient a
JOIN suggested_ingredient b ON a.id < b.id
WHERE 
  LOWER(a.name) LIKE LOWER(b.name) || '%'
  OR LOWER(b.name) LIKE LOWER(a.name) || '%'
ORDER BY a.name;
```

### Count how often each ingredient appears in recipes
```sql
SELECT 
    TRIM(unnest(string_to_array(ingredients, ','))) AS ingredient,
    COUNT(*) as frequency
FROM recipe 
WHERE ingredients IS NOT NULL AND ingredients != 'n/a'
GROUP BY TRIM(unnest(string_to_array(ingredients, ',')))
ORDER BY frequency DESC;
```

### Delete an ingredient by name
```sql
DELETE FROM suggested_ingredient WHERE name = 'ingredient_to_remove';
```

### Merge duplicate ingredients (update references if needed)
```sql
-- If you later have references to suggested_ingredient.id, you'd update them first
-- For now, just delete the duplicate
DELETE FROM suggested_ingredient WHERE name = 'potatoes'; -- keeping 'potato' instead
```

## Cleanup Strategy

1. ✅ **Run the migration** to populate initial data
2. ✅ **Export the list** of ingredients for review
3. ✅ **Identify patterns** (plurals, compounds, variations)
4. ✅ **Make decisions** on standardization rules
5. ✅ **Clean up database** using DELETE statements
6. ✅ **Document standards** for future ingredient additions

**Status**: Initial cleanup completed. Standards documented above.

## Future Improvements

Consider implementing:
- Fuzzy matching for autocomplete (catching "potato" when user types "potatoes")
- Ingredient categories (vegetables, proteins, spices, etc.)
- Automatic singular/plural normalization
- Ingredient aliases table (map "potatoes" → "potato", etc.)
