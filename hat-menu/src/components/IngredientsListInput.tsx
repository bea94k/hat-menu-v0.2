import { useFieldArray } from 'react-hook-form';
import type { Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { IngredientInput } from './IngredientInput';
import Button from './Button';
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
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>

            <div className="space-y-2">
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
        </div>
    );
}
