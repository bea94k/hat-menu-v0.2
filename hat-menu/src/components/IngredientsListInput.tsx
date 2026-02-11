import { useFieldArray } from 'react-hook-form';
import type { Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { IngredientInput } from './IngredientInput';

/**
 * Props use `any` for React Hook Form types due to TypeScript limitations:
 * - Generic form types (Control<TFormValues>, UseFormRegister<TFormValues>) don't compose well
 * - Nested array error types (FieldErrors for arrays) create incompatible type unions
 * - This component needs to work with any parent form structure containing an 'ingredients' array
 * Runtime type safety is maintained through Yup validation in the parent form
 */
interface IngredientsListInputProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: UseFormRegister<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors?: FieldErrors<any>;
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
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
                + Add Ingredient
            </button>
        </div>
    );
}
