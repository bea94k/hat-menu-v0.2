import { array, object, type InferType } from 'yup';
import { RecipeSchema, type Recipe } from './Recipes';

const MenuFormSchema = object({
    recipes: array().of(RecipeSchema),
});

type MenuForm = InferType<typeof MenuFormSchema>;

interface Menu {
    recipes: Recipe[];
    id: string;
}

export { MenuFormSchema };
export type { MenuForm, Menu };