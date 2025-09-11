import { useForm, type SubmitHandler } from 'react-hook-form';
import type { RecipeForm } from '../types/Recipes';

const AddRecipeForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RecipeForm>();
    const onSubmit: SubmitHandler<RecipeForm> = (data) => console.log(data);
    // TODO: use validator instead of validating by hand
    // TODO: make sure required fields have correct markup, asterisks, explicit error messages

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="recipeName">Recipe Name:</label>
            <input type="text" id="recipeName" {...register('name', { required: 'Recipe name is required' })} />
            <button type="submit">Add Recipe</button>
            <div>
                <p>Errors: {errors.name?.message}</p>
            </div>
        </form>
    );
};

export default AddRecipeForm;
