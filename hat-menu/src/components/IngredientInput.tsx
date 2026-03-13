import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { useSuggestedIngredients } from '../data/ingredientsApi';
import { units, type Ingredient } from '../schemas/Ingredients';
import type { RecipeForm } from '../schemas/Recipes';
import Button from './primitives/Button';
import Input from './primitives/Input';
import Select from './primitives/Select';

interface IngredientInputProps {
    index: number;
    register: UseFormRegister<RecipeForm>;
    onRemove: () => void;
    errors?: FieldErrors<Ingredient>;
    disableRemove?: boolean;
}

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
        <div className="flex flex-col md:flex-row gap-3 rounded-md border border-gray-300 bg-white p-3">

            <div className="flex-1 min-w-0">
                <label htmlFor={nameId} className="sr-only">
                    Ingredient name {index + 1}
                </label>
                <Input
                    id={nameId}
                    list={datalistId}
                    placeholder="e.g., flour, salt, egg"
                    autoComplete="off"
                    aria-describedby={errors?.name ? `${nameId}-error` : undefined}
                    aria-invalid={!!errors?.name}
                    hasError={!!errors?.name}
                    {...register(`ingredients.${index}.name`)}
                />
                {/* Native HTML datalist for autocomplete */}
                <datalist id={datalistId}>
                    {!isLoading &&
                        ingredients?.map((ingredient) => (
                            <option key={ingredient.id} value={ingredient.name} />
                        ))}
                </datalist>
                {errors?.name && (
                    <p id={`${nameId}-error`} className="text-red-600 text-sm mt-1" role="alert">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div className="w-full md:w-24">
                <label htmlFor={quantityId} className="sr-only">
                    Quantity {index + 1}
                </label>
                <Input
                    type="number"
                    id={quantityId}
                    placeholder="Qty"
                    step="1"
                    min="0"
                    max="10000"
                    aria-describedby={errors?.quantity ? `${quantityId}-error` : undefined}
                    aria-invalid={!!errors?.quantity}
                    hasError={!!errors?.quantity}
                    {...register(`ingredients.${index}.quantity`, { valueAsNumber: true })}
                />
                {errors?.quantity && (
                    <p id={`${quantityId}-error`} className="text-red-600 text-sm mt-1" role="alert">
                        {errors.quantity.message}
                    </p>
                )}
            </div>

            <div className="w-full md:w-28">
                <label htmlFor={unitId} className="sr-only">
                    Unit {index + 1}
                </label>
                <Select
                    id={unitId}
                    aria-describedby={errors?.unit ? `${unitId}-error` : undefined}
                    aria-invalid={!!errors?.unit}
                    hasError={!!errors?.unit}
                    {...register(`ingredients.${index}.unit`)}
                >
                    {units.map((unit) => (
                        <option key={unit || 'empty'} value={unit}>
                            {unit || '(none)'}
                        </option>
                    ))}
                </Select>
                {errors?.unit && (
                    <p id={`${unitId}-error`} className="text-red-600 text-sm mt-1" role="alert">
                        {errors.unit.message}
                    </p>
                )}
            </div>

            <Button
                variant='outline'
                onClick={onRemove}
                disabled={disableRemove}
                className='w-auto self-start'
                aria-label={`Remove ingredient ${index + 1}`}
            >
                Remove
            </Button>
        </div>
    );
}
