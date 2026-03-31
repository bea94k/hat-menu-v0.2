import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type Resolver, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { updateRecipe } from '../data/recipesApi';
import { RecipeFormSchema, type RecipeForm } from '../schemas/Recipes';
import type { RecipeWithIngredients } from '../schemas/supabase-helpers';
import { IngredientsListInput } from './IngredientsListInput';
import { isSessionError } from '../utils/auth';
import Button from './primitives/Button';
import FormInputError from './primitives/FormInputError';
import Input from './primitives/Input';
import Label from './primitives/Label';

interface EditRecipeFormProps {
    recipe: RecipeWithIngredients;
}

function parseRecipeIngredients(recipe: RecipeWithIngredients): RecipeForm['ingredients'] {
    // Use structured ingredients from junction table if available
    if (recipe.recipe_ingredient && recipe.recipe_ingredient.length > 0) {
        return recipe.recipe_ingredient.map(ing => ({
            name: ing.ingredient_name,
            quantity: ing.quantity ?? undefined,
            unit: ing.unit ?? '',
        }));
    }

    // Fall back to legacy comma-separated text in recipe.ingredients
    if ('ingredients' in recipe && typeof recipe.ingredients === 'string' && recipe.ingredients) {
        const items = recipe.ingredients.split(',').map(s => s.trim()).filter(Boolean);
        if (items.length > 0) {
            return items.map(name => ({ name, quantity: undefined, unit: '' }));
        }
    }

    return [{ name: '', quantity: undefined, unit: '' }];
}

const EditRecipeForm = ({ recipe }: EditRecipeFormProps) => {
    const navigate = useNavigate();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RecipeForm>({
        resolver: yupResolver(RecipeFormSchema) as Resolver<RecipeForm>,
        defaultValues: {
            name: recipe.name,
            url: recipe.url ?? '',
            ingredients: parseRecipeIngredients(recipe),
            ready_for_production: recipe.ready_for_production ?? false,
        }
    });

    const [submitStatus, setSubmitStatus] = useState<string | null>(null);

    const onSubmit: SubmitHandler<RecipeForm> = async (data) => {
        setSubmitStatus('Saving...');
        try {
            await updateRecipe(recipe.id, data);

            setSubmitStatus('Recipe updated!');
        } catch (error: unknown) {
            console.error('Error updating recipe:', error);

            if (isSessionError(error)) {
                navigate('/sign-in', { replace: true, state: { reason: 'session-expired' } });
                return;
            }

            setSubmitStatus('An error occurred while updating the recipe.');
        }
    };

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <div>
                <Label htmlFor="recipe-name">Recipe Name:</Label>
                <Input
                    id="recipe-name"
                    aria-describedby={errors.name && 'error-name'}
                    hasError={!!errors.name}
                    autoComplete="off"
                    required
                    disabled={isSubmitting}
                    {...register('name')}
                />
                {errors.name && (
                    <FormInputError
                        id="error-name"
                        text={errors.name.message ?? 'Invalid input'}
                    />
                )}
            </div>
            <div>
                <Label htmlFor="recipe-url">Recipe URL (optional):</Label>
                <Input
                    id="recipe-url"
                    aria-describedby={errors.url && 'error-url'}
                    hasError={!!errors.url}
                    autoComplete="off"
                    disabled={isSubmitting}
                    {...register('url')}
                />
                {errors.url && (
                    <FormInputError
                        id="error-url"
                        text={errors.url.message ?? 'Invalid input'}
                    />
                )}
            </div>

            <IngredientsListInput
                control={control}
                register={register}
                errors={errors.ingredients}
                disabled={isSubmitting}
            />

            <div className="flex items-center gap-2">
                <input
                    id="ready-for-production"
                    type="checkbox"
                    disabled={isSubmitting}
                    {...register('ready_for_production')}
                    className="h-4 w-4 rounded border-gray-300 text-primary-500"
                />
                <Label htmlFor="ready-for-production" className="mb-0">
                    Ready for production
                </Label>
            </div>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Update Recipe'}
            </Button>

            <div role="status">
                {submitStatus && (
                    <div className='border-2 border-primary-300 rounded-md p-2 bg-primary-100'>
                        <p>{submitStatus}</p>
                    </div>
                )}
            </div>
        </form>
    );
};

export default EditRecipeForm;
