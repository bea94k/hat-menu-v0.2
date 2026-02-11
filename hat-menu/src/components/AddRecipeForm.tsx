import { useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useRecipesMutation } from '../data/recipesApi';
import { RecipeFormSchema, type RecipeForm } from '../schemas/Recipes';
import { IngredientsListInput } from './IngredientsListInput';

const AddRecipeForm = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { mutate } = useRecipesMutation();

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
            await mutate('insert', data, 'NEW');
            reset();
            inputRef?.current?.focus();
            setSubmitStatus('Recipe added successfully!');
        } catch (error) {
            console.error('Error saving recipe:', error);
            setSubmitStatus('An error occurred while adding the recipe.');
        }
    };

    // to be able to use ref along with register, ref for focusing after submit
    const { ref, ...rest } = register('name');

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="recipe-name">Recipe Name:</label>
                <input
                    type="text"
                    id="recipe-name"
                    aria-describedby='error-name'
                    autoComplete="off"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                    {...rest}
                    ref={(e) => {
                        ref(e);
                        inputRef.current = e;
                    }}
                />
            </div>
            <div>
                <label htmlFor="recipe-url">Recipe URL:</label>
                <input
                    type="text"
                    id="recipe-url"
                    aria-describedby='error-url'
                    autoComplete="off"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                    {...register('url')}
                />
            </div>

            <IngredientsListInput
                control={control}
                register={register}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                errors={errors.ingredients as any}
            />

            <button type="submit" style={{ border: '2px solid black' }}>Add Recipe</button>
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
