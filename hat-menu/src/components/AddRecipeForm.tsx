import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { RecipeFormSchema, type RecipeForm } from '../types/Recipes';
import { addRecipe } from '../data/recipesApi';

const AddRecipeForm = () => {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({resolver: yupResolver(RecipeFormSchema)});
    const [submitStatus, setSubmitStatus] = useState<string | null>(null);
    const onSubmit: SubmitHandler<RecipeForm> = async (data) => {
        setSubmitStatus(null);
        try {
            const newRecipe = await addRecipe({ name: data.name });
            setSubmitStatus(`Recipe added successfully! ${newRecipe?.name}, ${newRecipe?.id}`);
            reset();
        } catch (error: unknown) {
            setSubmitStatus(error instanceof Error ? error.message : 'An error occurred while adding the recipe.');
        }
    };    
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="recipeName">Recipe Name:</label>
            <input type="text" id="recipeName" autoComplete="off" required {...register('name')} />
            <button type="submit">Add Recipe</button>
            {Object.keys(errors).length > 0 && (
                <div style={{ border: '2px solid red', padding: '1rem' }}>
                    <ul>Errors from form:
                        {Object.entries(errors).map(([key, value]) => (
                            <li key={key}>{key}: {value?.message}</li>
                        ))}
                    </ul>
                </div>
            )}
            {submitStatus && (
                <div style={{ border: '5px solid black', padding: '1rem' }}>    {/* shouldn't be red, cause OK status also shown here */}
                    <p>Status from backend: {submitStatus}</p>
                </div>
            )}
        </form>
    );
};

export default AddRecipeForm;
