import { number, object, string, type InferType } from 'yup';

// Units hardcoded here. If they are in a separate file and imported here, it can't be strictly typed (only as string).
const units = [
    'g',
    'ml',
    'dl',
    'tsp',
    'tbsp',
    'cup',
    'piece',
    'clove'
] as const;
type UnitType = typeof units[number];

const IngredientSchema = object({
    name: string().required().min(1).max(100),
    unit: string().oneOf(units),
    quantity: number().min(0).max(10000),
});

type Ingredient = InferType<typeof IngredientSchema>

export { units, IngredientSchema };
export type { Ingredient };