import { array, object, string, type InferType } from 'yup';

const MenuFormSchema = object({
    recipes: array().of(string().uuid()),
});

type MenuForm = InferType<typeof MenuFormSchema>;

const MenuSchema = object({
    recipes: array().of(string().uuid()).required(),
    id: string().uuid().required(),
});

type Menu = InferType<typeof MenuSchema>;

export { MenuFormSchema, MenuSchema };
export type { MenuForm, Menu };