import { useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type Resolver, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { addRecipe } from '../data/recipesApi';
import { RecipeFormSchema, type RecipeForm } from '../schemas/Recipes';
import { IngredientsListInput } from './IngredientsListInput';
import { isSessionError } from '../utils/auth';
import Button from './primitives/Button';
import FormInputError from './primitives/FormInputError';
import Input from './primitives/Input';
import Label from './primitives/Label';

const DEFAULT_RECIPE_URL = 'www.default-example.com';

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
        resolver: yupResolver(RecipeFormSchema) as Resolver<RecipeForm>,
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
            const parsedData: RecipeForm = {
                ...data,
                url: data.url?.trim() ? data.url.trim() : DEFAULT_RECIPE_URL, // TODO: when recipe url not required in the db, let it be undefined and just await addRecipe(data)
            };

            const response = await addRecipe(parsedData);
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
                <Label htmlFor="recipe-name">Recipe Name:</Label>
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
                <Label htmlFor="recipe-url">Recipe URL:</Label>
                <Input
                    id="recipe-url"
                    aria-describedby={errors.url && 'error-url'}
                    hasError={!!errors.url}
                    autoComplete="off"
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
