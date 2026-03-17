import { number, object, string, type InferType } from 'yup';

// suggested ingredients from DB for autocomplete in add-recipe form
const SuggestedIngredientSchema = object({
    id: string().uuid().required(),
    name: string().required().min(1).max(100),
});
type SuggestedIngredient = InferType<typeof SuggestedIngredientSchema>

const NewSuggestedIngredientSchema = SuggestedIngredientSchema.omit(['id']);
type NewSuggestedIngredient = InferType<typeof NewSuggestedIngredientSchema>


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
    name: string().required('Name is required').min(1).max(10, 'Maximum 100 characters'),
    unit: string().oneOf(units),
    quantity: number()
        .typeError('Quantity is required') 
        .test(
            'is-decimal',
            'Quantity as decimal must have maximum three digits after comma',
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