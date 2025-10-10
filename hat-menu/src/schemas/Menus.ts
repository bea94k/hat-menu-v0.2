import { array, object, string, type InferType } from 'yup';

const MenuSchema = object({
    recipes: array().of(string().uuid()).required(),
    id: string().uuid().required(),
});
type Menu = InferType<typeof MenuSchema>;

const MenuFormSchema = MenuSchema.omit(['id']);
type MenuForm = InferType<typeof MenuFormSchema>;

export { MenuFormSchema, MenuSchema };
export type { MenuForm, Menu };