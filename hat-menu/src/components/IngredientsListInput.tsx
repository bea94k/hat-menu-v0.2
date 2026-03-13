import { useFieldArray } from 'react-hook-form';
import type { Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { IngredientInput } from './IngredientInput';
import Button from './primitives/Button';
import type { RecipeForm } from '../schemas/Recipes';

interface IngredientsListInputProps {
    control: Control<RecipeForm>;
    register: UseFormRegister<RecipeForm>;
    errors?: FieldErrors<RecipeForm>['ingredients'];
}

export function IngredientsListInput({ control, register, errors }: IngredientsListInputProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'ingredients',
    });

    const handleAddIngredient = () => {
        append({ name: '', quantity: undefined, unit: '' });
    };

    return (
        <fieldset>
            <legend
                className="font-bold text-gray-800"
            >
                Ingredients
            </legend>

            <div className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    <IngredientInput
                        key={field.id}
                        index={index}
                        register={register}
                        onRemove={() => remove(index)}
                        errors={errors?.[index]}
                        disableRemove={fields.length === 1}
                    />
                ))}
            </div>

            <Button
                variant='outline'
                onClick={handleAddIngredient}
            >
                + Add Ingredient
            </Button>
        </fieldset>
    );
}
