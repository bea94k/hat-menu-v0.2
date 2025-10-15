import { array, object, string, date, type InferType } from 'yup';
import { RecipeSchema } from './Recipes';

const MenuSchema = object({
    recipes: array().of(string().uuid()).required(),
    id: string().uuid().required(),
    startDate: string().required(), // stringified ISO date
    endDate: string().required() // stringified ISO date
});
type Menu = InferType<typeof MenuSchema>;

const MenuFormSchema = object({
    startDate: date().required(),
    endDate: date().required().when('startDate', (startDate, yup) => startDate && yup.min(startDate, 'End date must be later than start date')),
    recipes: array().of(RecipeSchema),
});
type MenuForm = InferType<typeof MenuFormSchema>;

export { MenuFormSchema, MenuSchema };
export type { MenuForm, Menu };