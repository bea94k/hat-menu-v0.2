import useSWR, { mutate } from 'swr';
import fetcher from './fetcher';
import type { Recipe, RecipeForm } from '../types/Recipes';

const baseAPI = 'http://localhost:3000';

function useRecipes () {
    const { data, error, isLoading } = useSWR<Recipe[]>(`${baseAPI}/recipes`, fetcher);
 
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
        await mutate(`${baseAPI}/recipes`);
        return newRecipe;
    } catch (error) {
        console.error('Error adding recipe:', error);
        return null;
    }
}

export { useRecipes, addRecipe };