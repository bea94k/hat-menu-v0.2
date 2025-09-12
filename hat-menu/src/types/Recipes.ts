import { object, string, type InferType } from 'yup';

const RecipeFormSchema = object({
    name: string().required(),
});

type RecipeForm = InferType<typeof RecipeFormSchema>;
interface Recipe {
    name: string;
    id: string;
}

export { RecipeFormSchema };
export type { RecipeForm, Recipe };