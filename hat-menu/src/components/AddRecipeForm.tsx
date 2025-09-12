import { useForm, type SubmitHandler } from 'react-hook-form';
import type { RecipeForm } from '../types/Recipes';
import { addRecipe } from '../data/fetchingHooks';
import React, { useEffect } from 'react';

const AddRecipeForm = () => {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitSuccessful },
    } = useForm<RecipeForm>();
    const [submitStatus, setSubmitStatus] = React.useState<string | null>(null);
    const onSubmit: SubmitHandler<RecipeForm> = async (data) => {
        setSubmitStatus(null);
        try {
            const newRecipe = await addRecipe({ name: data.name });
            setSubmitStatus(`Recipe added successfully! ${newRecipe?.name}, ${newRecipe?.id}`);
        } catch (error: unknown) {
            setSubmitStatus(error instanceof Error ? error.message : 'An error occurred while adding the recipe.');
        }
    };
    // TODO: use validator instead of validating by hand
    // TODO: make sure required fields have correct markup, asterisks, explicit error messages
    
    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset]);


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="recipeName">Recipe Name:</label>
            <input type="text" id="recipeName" {...register('name', { required: 'Recipe name is required' })} />
            <button type="submit">Add Recipe</button>
            <div>
                <p>Errors from form: {errors.name?.message}</p>
                <p>Status from backend: {submitStatus}</p>
            </div>
        </form>
    );
};

export default AddRecipeForm;
