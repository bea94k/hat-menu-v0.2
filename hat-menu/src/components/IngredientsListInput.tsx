import { useFieldArray } from 'react-hook-form';
import type { Control, UseFormRegister, FieldErrors, FieldValues } from 'react-hook-form';
import { IngredientInput } from './IngredientInput';
import type { Ingredient } from '../schemas/Ingredients';

interface IngredientsListInputProps {
    control: Control<FieldValues>;
    register: UseFormRegister<FieldValues>;
    errors?: FieldErrors<Ingredient[]>;
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
                        errors={errors}
                        disableRemove={fields.length === 1}
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={handleAddIngredient}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
                + Add Ingredient
            </button>
        </div>
    );
}
