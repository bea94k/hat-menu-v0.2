import { array, object, string, type InferType } from 'yup';
import { IngredientSchema } from './Ingredients';

const RecipeFormSchema = object({
    name: string().required(),
    ingredients: array().of(IngredientSchema),
});

type RecipeForm = InferType<typeof RecipeFormSchema>;

const RecipeSchema = object({
    name: string().required(),
    id: string().uuid().required(),
});

type Recipe = InferType<typeof RecipeSchema>;

export { RecipeFormSchema, RecipeSchema };
export type { RecipeForm, Recipe };