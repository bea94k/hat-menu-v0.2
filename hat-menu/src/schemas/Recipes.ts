import { object, string, type InferType } from 'yup';
import type { Recipe, RecipeInsert, RecipeUpdate } from './supabase-helpers';

const RecipeSchema = object({
    id: string().uuid().required(),
    created_at: string().required(),
    name: string().required(),
    url: string().url().required(),
    ingredients: string().required(),
});

const RecipeFormSchema = RecipeSchema.omit(['id', 'created_at']);

type RecipeForm = InferType<typeof RecipeFormSchema>;

export type { Recipe, RecipeForm, RecipeInsert, RecipeUpdate };
export { RecipeFormSchema, RecipeSchema };