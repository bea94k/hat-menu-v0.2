import { array, object, type InferType } from 'yup';
import { RecipeSchema } from './Recipes';

const MenuFormSchema = object({
    recipes: array().of(RecipeSchema),
});

type MenuForm = InferType<typeof MenuFormSchema>;

interface Menu {
    recipes: number[];
    id: string;
}

export { MenuFormSchema };
export type { MenuForm, Menu };