import useSWR, { mutate } from 'swr';
import { baseAPI, fetcher } from './fetcher';
import type { Recipe, RecipeForm } from '../schemas/Recipes';

function useRecipes () {
    const { data, error, isLoading } = useSWR<Recipe[]>('/recipes', fetcher);
 
    return {
        recipes: data,
        isLoading,
        isError: error
    };
}

async function addRecipe(recipe: RecipeForm): Promise<Recipe | null> {
    try {
        const response = await fetch(`${baseAPI}/recipes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipe),
        });
        if (!response.ok) {
            throw new Error(`Failed to add recipe: ${response.statusText}`);
        }
        const newRecipe = await response.json();
        // Update SWR cache for recipes
        await mutate('/recipes');
        return newRecipe;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred while adding the recipe.');
    }
}

export { useRecipes, addRecipe };