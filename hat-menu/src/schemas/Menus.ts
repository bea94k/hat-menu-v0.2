import { array, object, string, date, type InferType } from 'yup';

const MenuSchema = object({
    recipes: array().of(string().uuid()).required(),
    id: string().uuid().required(),
    startDate: date().required(),
    endDate: date().required().when('startDate', (startDate, yup) => startDate && yup.min(startDate)),
});
type Menu = InferType<typeof MenuSchema>;

const MenuFormSchema = MenuSchema.omit(['id']);
type MenuForm = InferType<typeof MenuFormSchema>;

export { MenuFormSchema, MenuSchema };
export type { MenuForm, Menu };