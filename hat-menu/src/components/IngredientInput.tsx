import { useSuggestedIngredients } from '../data/ingredientsApi';
import { units, type Ingredient } from '../schemas/Ingredients';
import type { UseFormRegister, FieldErrors, FieldValues } from 'react-hook-form';

interface IngredientInputProps {
    index: number;
    register: UseFormRegister<FieldValues>;
    onRemove: () => void;
    errors?: FieldErrors<Ingredient[]>;
    disableRemove?: boolean;
}

/**
 * Atomic ingredient input component with autocomplete, quantity, and unit inputs
 * Designed for use with React Hook Form's useFieldArray
 */
export function IngredientInput({
    index,
    register,
    onRemove,
    errors,
    disableRemove = false,
}: IngredientInputProps) {
    const { ingredients, isLoading } = useSuggestedIngredients();

    // Generate unique IDs for accessibility
    const nameId = `ingredient-name-${index}`;
    const quantityId = `ingredient-quantity-${index}`;
    const unitId = `ingredient-unit-${index}`;
    const datalistId = `ingredient-suggestions-${index}`;

    return (
        <div className="flex gap-2 items-start mb-2">
            {/* Ingredient Name Input with Autocomplete */}
            <div className="flex-1 min-w-0">
                <label htmlFor={nameId} className="sr-only">
                    Ingredient name {index + 1}
                </label>
                <input
                    type="text"
                    id={nameId}
                    list={datalistId}
                    placeholder="e.g., flour, salt, egg"
                    autoComplete="off"
                    aria-describedby={errors?.[index]?.name ? `${nameId}-error` : undefined}
                    aria-invalid={!!errors?.[index]?.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register(`ingredients.${index}.name`)}
                />
                {/* Native HTML datalist for autocomplete */}
                <datalist id={datalistId}>
                    {!isLoading &&
                        ingredients?.map((ingredient) => (
                            <option key={ingredient.id} value={ingredient.name} />
                        ))}
                </datalist>
                {errors?.[index]?.name && (
                    <p id={`${nameId}-error`} className="text-red-600 text-sm mt-1" role="alert">
                        {errors[index].name?.message}
                    </p>
                )}
            </div>

            {/* Quantity Input */}
            <div className="w-24">
                <label htmlFor={quantityId} className="sr-only">
                    Quantity {index + 1}
                </label>
                <input
                    type="number"
                    id={quantityId}
                    placeholder="Qty"
                    step="0.001"
                    min="0"
                    max="10000"
                    aria-describedby={errors?.[index]?.quantity ? `${quantityId}-error` : undefined}
                    aria-invalid={!!errors?.[index]?.quantity}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register(`ingredients.${index}.quantity`, { valueAsNumber: true })}
                />
                {errors?.[index]?.quantity && (
                    <p id={`${quantityId}-error`} className="text-red-600 text-sm mt-1" role="alert">
                        {errors[index].quantity?.message}
                    </p>
                )}
            </div>

            {/* Unit Select Dropdown */}
            <div className="w-28">
                <label htmlFor={unitId} className="sr-only">
                    Unit {index + 1}
                </label>
                <select
                    id={unitId}
                    aria-describedby={errors?.[index]?.unit ? `${unitId}-error` : undefined}
                    aria-invalid={!!errors?.[index]?.unit}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    {...register(`ingredients.${index}.unit`)}
                >
                    {units.map((unit) => (
                        <option key={unit || 'empty'} value={unit}>
                            {unit || '(none)'}
                        </option>
                    ))}
                </select>
                {errors?.[index]?.unit && (
                    <p id={`${unitId}-error`} className="text-red-600 text-sm mt-1" role="alert">
                        {errors[index].unit?.message}
                    </p>
                )}
            </div>

            {/* Remove Button */}
            <button
                type="button"
                onClick={onRemove}
                disabled={disableRemove}
                aria-label={`Remove ingredient ${index + 1}`}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Remove
            </button>
        </div>
    );
}
