import { addRecipe } from '../data/recipesApi';
import type { RecipeForm } from '../schemas/Recipes';
import RecipeFormBase from './RecipeFormBase';

const AddRecipeForm = () => {
    const handleSubmit = async (data: RecipeForm) => {
        const parsedData: RecipeForm = {
            ...data,
            url: data.url?.trim() || null,
            ready_for_production: data.ready_for_production ?? false,
        };

        const response = await addRecipe(parsedData);
        return `Recipe saved! with ID: ${response?.id}`;
    };

    return (
        <RecipeFormBase
            defaultValues={{
                name: '',
                url: '',
                ingredients: [{ name: '', quantity: undefined, unit: '' }],
                ready_for_production: false,
            }}
            onFormSubmit={handleSubmit}
            submitButtonText="Add Recipe"
            errorMessage="An error occurred while adding the recipe."
            resetOnSuccess
        />
    );
};

export default AddRecipeForm;
