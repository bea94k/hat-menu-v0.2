import useSWR, { mutate } from 'swr';
import { baseAPI, fetcher } from './fetcher';
import type { NewSuggestedIngredient, SuggestedIngredient } from '../schemas/Ingredients';

function useSuggestedIngredients () {
    const { data, error, isLoading } = useSWR<SuggestedIngredient[]>('/ingredients', fetcher);
 
    return {
        suggestedIngredients: data,
        isLoading,
        isError: error
    };
}

async function addSuggestedIngredients(ingredients: NewSuggestedIngredient): Promise<SuggestedIngredient[] | null> {
    // TODO: with proper backend, make sure this accepts an array to save at once, with one request. Make changes in the AddRecipeForm as well.
    // TODO: minimal error handling, as this is an additional feature
    try {
        const response = await fetch(`${baseAPI}/ingredients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ingredients),
        });
        if (!response.ok) {
            throw new Error(`Failed to add ingredients: ${response.statusText}`);
        }
        const updatedIngredients = await response.json();
        // Update SWR cache for ingredients
        await mutate('/ingredients');
        return updatedIngredients;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred while adding the ingredients.');
    }
}

export { useSuggestedIngredients, addSuggestedIngredients };