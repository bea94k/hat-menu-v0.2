import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useRecipes } from '../data/recipesApi';
import { MenuFormSchema, type MenuForm } from '../schemas/Menus';
import { getUniqueRandom } from '../utils/utils';
import { addMenu } from '../data/menusApi';
import { differenceInCalendarDays, addDays, format } from 'date-fns';
import { isSessionError } from '../utils/auth';
import Button from './primitives/Button';
import DateInput from './primitives/DateInput';
import FormInputError from './primitives/FormInputError';
import Label from './primitives/Label';

const CreateMenuForm = () => {
    const { recipes } = useRecipes();
    const navigate = useNavigate();

    const {
        register,
        control,
        trigger,
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
        trigger(); // validation, check if dates are fine
        if (numberOfDays <= 0) {
            replace([]); // clear recipes
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
        <form noValidate onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <div>
                <Label htmlFor="menu-start-date">Menu Start Date:</Label>
                <DateInput
                    id="menu-start-date" 
                    aria-describedby={errors.startDate && 'error-startDate'}
                    hasError={!!errors.startDate}
                    required 
                    {...register('startDate')}
                    onChange={() => replace([])}
                />
                {errors?.startDate && (
                    <FormInputError id="error-startDate" text={errors.startDate?.message ?? 'Invalid input'} />
                )}
            </div>
            <div>
                <Label htmlFor="menu-end-date">Menu End Date:</Label>
                <DateInput
                    id="menu-end-date" 
                    aria-describedby={errors.endDate && 'error-endDate'}
                    hasError={!!errors.endDate}
                    required 
                    {...register('endDate')}
                    onChange={() => replace([])}
                />
                {errors?.endDate && (
                    <FormInputError id="error-endDate" text={errors.endDate?.message ?? 'Invalid input'} />
                )}
            </div>

            <Button
                variant='outline' 
                onClick={() => getRandomMenu(differenceInCalendarDays(getValues('endDate'), getValues('startDate')) + 1 || 0)}>
                Get random recipes
            </Button>

            {getValues('recipes')?.length > 0 &&
            <div>
                <h2 className='text-xl font-semibold'>Suggested menu {format(getValues('startDate'), 'd MMM')}-{format(getValues('endDate'), 'd MMM')}</h2>
                <ol className='flex flex-col divide-y divide-gray-500'>
                    {getValues('recipes')?.map((recipe, index) => {
                        const startDate = new Date(getValues('startDate'));
                        const recipeDayOfWeek =format(addDays(startDate, index), 'EEE');
                    
                        return (
                            <li key={recipe.id} className='py-2 flex flex-col gap-2'>
                                {recipeDayOfWeek}: {recipe.name}
                                <div className='flex gap-2'>
                                    <Button
                                        onClick={() => swap(index, index - 1)}
                                        disabled={index === 0}
                                        aria-label={`Move up ${recipe.name}`}
                                    >
                                Up
                                    </Button>
                                    <Button
                                        onClick={() => swap(index, index + 1)}
                                        disabled={index === fields.length - 1}
                                        aria-label={`Move down ${recipe.name}`} 
                                    >
                               Down
                                    </Button>
                                    <Button
                                        onClick={() => randomizeRecipeAtIndex(index)}
                                        aria-label={`Change ${recipe.name}`}
                                    >
                                Change
                                    </Button>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>}

            <Button type="submit">Save menu</Button>

            <div 
                role="status">
                {submitStatus && (
                    <div className='border-2 border-primary-300 rounded-md p-2 bg-primary-100' /* shouldn't be red, cause OK status also shown here */>
                        <p>{submitStatus}</p>
                    </div>
                )}
            </div>
        </form>
    );
};

export default CreateMenuForm;
