import { array, object, string, type InferType } from 'yup';

const MenuFormSchema = object({
    recipes: array().of(string().uuid()),
});

type MenuForm = InferType<typeof MenuFormSchema>;

interface Menu {
    recipes: number[];
    id: string;
}

export { MenuFormSchema };
export type { MenuForm, Menu };