import { array, object, string, date, type InferType } from 'yup';
import { RecipeSchema } from './Recipes';
import type { Menu } from './supabase-helpers';

const MenuSchema = object({
    recipes: array().of(string().uuid()).required(),
    id: string().uuid().required(),
    startDate: string().required(), // stringified ISO date
    endDate: string().required() // stringified ISO date
});

const MenuFormSchema = object({
    startDate: date()
        .nullable()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .typeError('Start date is required') // for malformed, tests, programmatic setValue
        .required('Start date is required'), // for empty in UI date input
    endDate: date()
        .nullable()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .typeError('End date is required') // for malformed, tests, programmatic setValue
        .required('End date is required') // for empty in UI date input
        .when('startDate', ([startDate], schema) => (
            startDate instanceof Date && !Number.isNaN(startDate.getTime())
                ? schema.min(startDate, 'End date must be later than start date')
                : schema
        )),
    recipes: array().of(RecipeSchema).required(),
});
type MenuForm = InferType<typeof MenuFormSchema>;

export { MenuFormSchema, MenuSchema };
export type { MenuForm, Menu };