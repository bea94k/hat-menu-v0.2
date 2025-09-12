import { object, string, type InferType } from 'yup';

const RecipeFormSchema = object({
    name: string().required(),
});

type RecipeForm = InferType<typeof RecipeFormSchema>;

const RecipeSchema = object({
    name: string().required(),
    id: string().required(),
});

type Recipe = InferType<typeof RecipeSchema>;

export { RecipeFormSchema, RecipeSchema };
export type { RecipeForm, Recipe };