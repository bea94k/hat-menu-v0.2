import { updateRecipe } from '../data/recipesApi';
import type { RecipeForm } from '../schemas/Recipes';
import type { RecipeWithIngredients } from '../schemas/supabase-helpers';
import { parseRecipeIngredients } from '../utils/utils';
import RecipeFormBase from './RecipeFormBase';

interface EditRecipeFormProps {
    recipe: RecipeWithIngredients;
}

const EditRecipeForm = ({ recipe }: EditRecipeFormProps) => {
    const handleSubmit = async (data: RecipeForm) => {
        await updateRecipe(recipe.id, data);
        return 'Recipe updated!';
    };

    return (
        <RecipeFormBase
            defaultValues={{
                name: recipe.name,
                url: recipe.url ?? '',
                ingredients: parseRecipeIngredients(recipe),
                ready_for_production: recipe.ready_for_production ?? false,
            }}
            onFormSubmit={handleSubmit}
            submitButtonText="Update Recipe"
            errorMessage="An error occurred while updating the recipe."
        />
    );
};

export default EditRecipeForm;
