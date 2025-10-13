import { array, object, string, type InferType } from 'yup';
import { IngredientSchema } from './Ingredients';

const RecipeSchema = object({
    id: string().uuid().required(),
    name: string().required(),
    url: string().url(),
    ingredients: array().of(IngredientSchema),
});
type Recipe = InferType<typeof RecipeSchema>;

const RecipeFormSchema = RecipeSchema.omit(['id']);
type RecipeForm = InferType<typeof RecipeFormSchema>;

export { RecipeFormSchema, RecipeSchema };
export type { RecipeForm, Recipe };