import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm, type FieldErrors, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useRecipes } from '../data/recipesApi';
import { type Recipe} from '../schemas/Recipes';
import { MenuFormSchema, type MenuForm } from '../schemas/Menus';
import { getUniqueRandom } from '../utils/utils';
import { addMenu } from '../data/menusApi';
import { differenceInCalendarDays, addDays, format } from 'date-fns';
import { isSessionError } from '../utils/auth';
import Button from './primitives/Button';
import DateInput from './primitives/DateInput';

const CreateMenuForm = () => {
    const { recipes } = useRecipes();
    const navigate = useNavigate();

    const {
        register,
        control,
        reset,
        setValue,
        getValues,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(MenuFormSchema)
    });
    const { fields, update, swap, replace } = useFieldArray({
        control,
        name: 'recipes',
    });

    const [submitStatus, setSubmitStatus] = useState<string | null>(null);

    const getRandomMenu = (numberOfDays: number) => {
        if (numberOfDays <= 0) {
            replace([]);
            setSubmitStatus('End date must be later than start date');
            return;
        }
        setSubmitStatus('');
        setValue('recipes', getUniqueRandom(numberOfDays, recipes || []));
    };

    const randomizeRecipeAtIndex = (index: number) => {
        if (!recipes || recipes.length === 0) return;
        const usedIds = getValues('recipes')?.map(r => r.id);
        const unusedRecipes = recipes.filter(r => !usedIds?.includes(r.id));
        if (unusedRecipes.length === 0) return;
        const newRandomRecipe = unusedRecipes[Math.floor(Math.random() * unusedRecipes.length)];
        update(index, newRandomRecipe);
    };


    const onSubmit: SubmitHandler<MenuForm> = async (data) => {
        setSubmitStatus('Saving...');
        if (!data.recipes || data.recipes.length === 0) {
            setSubmitStatus('First randomize some recipes into a menu');
            return;
        }
        try {
            const response = await addMenu(data);
            setSubmitStatus(`Menu saved! with ID: ${response?.id}`);
            reset();
        } catch (error: unknown) {
            console.error('Error saving menu:', error);

            if (isSessionError(error)) {
                navigate('/sign-in', { replace: true, state: { reason: 'session-expired' } });
                return;
            }

            setSubmitStatus('An error occurred while saving the menu.');
        }
    };

    return (
        <form noValidate style={{ border: '4px solid magenta', padding: '1rem' }} onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="menu-start-date">Menu Start Date:</label>
                <DateInput
                    id="menu-start-date" 
                    aria-describedby='error-startDate'
                    aria-invalid={!!errors.startDate}
                    hasError={!!errors.startDate}
                    required 
                    {...register('startDate')}
                    onChange={() => replace([])}
                />
            </div>
            <div>
                <label htmlFor="menu-end-date">Menu End Date:</label>
                <DateInput
                    id="menu-end-date" 
                    aria-describedby='error-endDate'
                    aria-invalid={!!errors.endDate}
                    hasError={!!errors.endDate}
                    required 
                    {...register('endDate')}
                    onChange={() => replace([])}
                />
            </div>

            <h2>Suggested menu</h2>
            <Button
                variant='outline' 
                onClick={() => getRandomMenu(differenceInCalendarDays(getValues('endDate'), getValues('startDate')) + 1 || 0)}>
                Get random recipes
            </Button>
            <ol>
                {getValues('recipes')?.map((recipe, index) => {
                    const startDate = getValues('startDate') ? new Date(getValues('startDate')) : null;
                    const recipeDate = startDate ? format(addDays(startDate, index), 'd MMM yyyy') : '';
                    
                    return (
                        <li key={recipe.id}>
                            <Button
                                onClick={() => swap(index, index - 1)}
                                disabled={index === 0}
                                aria-label={`Move up ${recipe.name}`}
                            >
                                Move up
                            </Button>
                            <Button
                                onClick={() => swap(index, index + 1)}
                                disabled={index === fields.length - 1}
                                aria-label={`Move down ${recipe.name}`} 
                            >
                                Move down
                            </Button>
                            <Button
                                onClick={() => randomizeRecipeAtIndex(index)}
                                aria-label={`Change ${recipe.name}`}
                            >
                                Change
                            </Button>
                            <strong>{recipeDate}</strong> - {recipe.name}
                        </li>
                    );
                })}
            </ol>

            <Button type="submit">Save menu</Button>

            {Object.keys(errors).length > 0 && (
                <div style={{ border: '2px solid red', padding: '1rem' }}>
                    <ul>
                        {Object.entries(errors)
                            .filter(([key]) => key !== 'recipes')
                            .map(([key, value]) => (
                                <li key={key} id={`error-${key}`}>{key}: {value.message}</li>
                            ))}
                        {Array.isArray(errors.recipes) &&
                            errors.recipes.map((recipeError: FieldErrors<Recipe[]>, index) => (
                                Object.entries(recipeError).map(([fieldKey, fieldError]) => (
                                    <li key={`recipe-${index}-${fieldKey}`} id={`error-recipe-${index}-${fieldKey}`}>
                                            Recipe {index + 1} {fieldKey}: {fieldError?.message || 'Unhandled validation error'}
                                    </li>)
                                )
                            ))
                        }
                    </ul>
                </div>
            )}
            <div 
                role="status"
                aria-live="polite">
                {submitStatus && (
                    <div style={{ border: '5px solid black', padding: '1rem' }} /* shouldn't be red, cause OK status also shown here */>
                        <p>{submitStatus}</p>
                    </div>
                )}
            </div>
        </form>
    );
};

export default CreateMenuForm;
