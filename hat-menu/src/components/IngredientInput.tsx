import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { useSuggestedIngredients } from '../data/ingredientsApi';
import { units, type Ingredient } from '../schemas/Ingredients';
import type { RecipeForm } from '../schemas/Recipes';
import Button from './primitives/Button';
import FormInputError from './primitives/FormInputError';
import Input from './primitives/Input';
import Label from './primitives/Label';
import Select from './primitives/Select';

interface IngredientInputProps {
    index: number;
    register: UseFormRegister<RecipeForm>;
    onRemove: () => void;
    errors?: FieldErrors<Ingredient>;
    disabled?: boolean;
    disableRemove?: boolean;
}

export function IngredientInput({
    index,
    register,
    onRemove,
    errors,
    disabled = false,
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
                <Label htmlFor={nameId} className="sr-only">
                    Name, ingredient {index + 1}
                </Label>
                <Input
                    id={nameId}
                    list={datalistId}
                    placeholder="e.g., flour, salt, egg"
                    autoComplete="off"
                    aria-describedby={errors?.name && `${nameId}-error`}
                    hasError={!!errors?.name}
                    disabled={disabled}
                    {...register(`ingredients.${index}.name`)}
                    required
                />
                {/* Native HTML datalist for autocomplete */}
                <datalist id={datalistId}>
                    {!isLoading &&
                        ingredients?.map((ingredient) => (
                            <option key={ingredient.id} value={ingredient.name} />
                        ))}
                </datalist>
                {errors?.name && (
                    <FormInputError
                        id={`${nameId}-error`}
                        text={errors.name.message ?? 'Invalid input'}
                    />
                )}
            </div>

            <div className="w-full md:w-24">
                <Label htmlFor={quantityId} className="sr-only">
                    Quantity, ingredient {index + 1}
                </Label>
                <Input
                    type="number"
                    id={quantityId}
                    placeholder="Qty"
                    step="1"
                    min="0"
                    max="10000"
                    aria-describedby={errors?.quantity && `${quantityId}-error`}
                    hasError={!!errors?.quantity}
                    disabled={disabled}
                    {...register(`ingredients.${index}.quantity`, { valueAsNumber: true })}
                    required
                />
                {errors?.quantity && (
                    <FormInputError
                        id={`${quantityId}-error`}
                        text={errors.quantity.message ?? 'Invalid input'}
                    />
                )}
            </div>

            <div className="w-full md:w-28">
                <Label htmlFor={unitId} className="sr-only">
                    Unit, ingredient {index + 1}
                </Label>
                <Select
                    id={unitId}
                    aria-describedby={errors?.unit && `${unitId}-error`}
                    hasError={!!errors?.unit}
                    disabled={disabled}
                    {...register(`ingredients.${index}.unit`)}
                >
                    {units.map((unit) => (
                        <option key={unit || 'empty'} value={unit}>
                            {unit || '(none)'}
                        </option>
                    ))}
                </Select>
                {errors?.unit && (
                    <FormInputError
                        id={`${unitId}-error`}
                        text={errors.unit.message ?? 'Invalid input'}
                    />
                )}
            </div>

            <Button
                variant='outline'
                onClick={onRemove}
                disabled={disabled || disableRemove}
                className='w-auto self-start'
                aria-label={`Remove ingredient ${index + 1}`}
            >
                Remove
            </Button>
        </div>
    );
}
