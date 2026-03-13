import { useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { addRecipe } from '../data/recipesApi';
import { RecipeFormSchema, type RecipeForm } from '../schemas/Recipes';
import { IngredientsListInput } from './IngredientsListInput';
import { isSessionError } from '../utils/auth';
import Button from './primitives/Button';
import FormInputError from './primitives/FormInputError';
import Input from './primitives/Input';

const AddRecipeForm = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const {
        register,
        control,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<RecipeForm>({
        resolver: yupResolver(RecipeFormSchema),
        defaultValues: {
            name: '',
            url: '',
            ingredients: [{ name: '', quantity: undefined, unit: '' }],
        }
    });

    const [submitStatus, setSubmitStatus] = useState<string | null>(null);
    const onSubmit: SubmitHandler<RecipeForm> = async (data) => {
        setSubmitStatus(null);
        try {
            const response = await addRecipe(data);
            setSubmitStatus(`Recipe saved! with ID: ${response?.id}`);
            reset();
            inputRef?.current?.focus();
        } catch (error: unknown) {
            console.error('Error saving recipe:', error);

            if (isSessionError(error)) {
                navigate('/sign-in', { replace: true, state: { reason: 'session-expired' } });
                return;
            }

            setSubmitStatus('An error occurred while adding the recipe.');
        }
    };

    // to be able to use ref along with register, ref for focusing after submit
    const { ref, ...rest } = register('name');

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="recipe-name">Recipe Name:</label>
                <Input
                    id="recipe-name"
                    aria-describedby={errors.name && 'error-name'}
                    hasError={!!errors.name}
                    autoComplete="off"
                    required
                    {...rest}
                    ref={(e) => {
                        ref(e);
                        inputRef.current = e;
                    }}
                />
                {errors.name && (
                    <FormInputError
                        id="error-name"
                        text={errors.name.message ?? 'Invalid input'}
                    />
                )}
            </div>
            <div>
                <label htmlFor="recipe-url">Recipe URL:</label>
                <Input
                    id="recipe-url"
                    aria-describedby={errors.url && 'error-url'}
                    hasError={!!errors.url}
                    autoComplete="off"
                    required
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
            />

            <Button type="submit">Add Recipe</Button>
            {Object.keys(errors).length > 0 && (
                <div style={{ border: '2px solid red', padding: '1rem' }}>
                    <ul>
                        {Object.entries(errors).map(([key, value]) => (
                            <li key={key} id={`error-${key}`}>
                                {value?.message || `${key}: Invalid input`}
                            </li>
                        ))}
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

export default AddRecipeForm;
