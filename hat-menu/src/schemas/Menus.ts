import { array, object, string, date, type InferType } from 'yup';
import { RecipeSchema } from './Recipes';

const MenuSchema = object({
    recipes: array().of(string().uuid()).required(),
    id: string().uuid().required(),
    startDate: date().required(),
    endDate: date().required().when('startDate', (startDate, yup) => startDate && yup.min(startDate, 'End date must be later than start date')),
});
type Menu = InferType<typeof MenuSchema>;

const MenuFormSchema = object({
    startDate: MenuSchema.fields.startDate,
    endDate: MenuSchema.fields.endDate,
    recipes: array().of(RecipeSchema),
});
/* const MenuFormSchema = MenuSchema.omit(['id']); */
type MenuForm = InferType<typeof MenuFormSchema>;

export { MenuFormSchema, MenuSchema };
export type { MenuForm, Menu };