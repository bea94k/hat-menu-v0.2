import { number, object, string, type InferType } from 'yup';

// for autocomplete in add-recipe form
const NewSuggestedIngredientSchema = object({
    name: string().required().min(1).max(100),
});

type NewSuggestedIngredient = InferType<typeof NewSuggestedIngredientSchema>

const SuggestedIngredientSchema = object({
    id: string().uuid().required(),
    name: string().required().min(1).max(100),
});

type SuggestedIngredient = InferType<typeof SuggestedIngredientSchema>


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

const IngredientSchema = object({
    name: string().required().min(1).max(100),
    unit: string().oneOf(units),
    quantity: number().test(
        'is-decimal',
        'quantity as decimal must have maximum three digits after comma',
        (val) => {
            if (val != undefined) {
                return patternThreeDigitsAfterComma.test(val.toString());
            }
            return true;
        }
    ).min(0).max(10000),
});

type Ingredient = InferType<typeof IngredientSchema>

export { units, IngredientSchema, SuggestedIngredientSchema, NewSuggestedIngredientSchema };
export type { Ingredient, SuggestedIngredient, NewSuggestedIngredient };