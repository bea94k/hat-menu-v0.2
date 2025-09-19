import { number, object, string, type InferType } from 'yup';

const patternThreeDigitsAfterComma = /^\d+(\.\d{0,3})?$/;

// Units hardcoded here. If they are in a separate file and imported here, it can't be strictly typed (only as string).
const units = [
    '',
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
    quantity: number().test(
        'is-decimal',
        'The quantity should be a decimal with maximum three digits after comma',
        (val) => {
            if (val != undefined) {
                return patternThreeDigitsAfterComma.test(val.toString());
            }
            return true;
        }
    ).min(0).max(10000),
});

type Ingredient = InferType<typeof IngredientSchema>

export { units, IngredientSchema };
export type { Ingredient };