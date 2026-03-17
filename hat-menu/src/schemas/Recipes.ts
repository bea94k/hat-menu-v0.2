import { array, object, string, type InferType } from 'yup';
import type { Recipe, RecipeInsert, RecipeUpdate } from './supabase-helpers';
import { IngredientSchema } from './Ingredients';

const RecipeSchema = object({
    id: string().uuid().required(),
    created_at: string().required(),
    name: string().required(),
    url: string().nullable().defined(),
    ingredients: string().required(),
});

const RecipeFormSchema = object({
    name: string().required('Name is required'),
    url: string()
        .nullable()
        .transform((_value, originalValue) => { // handle empty string as null
            if (typeof originalValue !== 'string') {
                return originalValue;
            }

            const trimmed = originalValue.trim();
            return trimmed.length > 0 ? trimmed : null;
        })
        .defined(),
    ingredients: array().of(IngredientSchema).min(1, 'At least one ingredient is required').required(),
});

type RecipeForm = InferType<typeof RecipeFormSchema>;

export type { Recipe, RecipeForm, RecipeInsert, RecipeUpdate };
export { RecipeFormSchema, RecipeSchema };