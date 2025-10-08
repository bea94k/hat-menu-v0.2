import useSWR, { mutate } from 'swr';
import { baseAPI, fetcher } from './fetcher';
import type { SuggestedIngredient } from '../schemas/Ingredients';

function useIngredients () {
    const { data, error, isLoading } = useSWR<SuggestedIngredient[]>('/ingredients', fetcher);
 
    return {
        ingredients: data,
        isLoading,
        isError: error
    };
}

async function addIngredients(ingredients: SuggestedIngredient[]): Promise<SuggestedIngredient[] | null> {
    try {
        const response = await fetch(`${baseAPI}/ingredients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ingredients), // TODO: check if this works with several new ingredients at once or does it need to be called forEach
        });
        if (!response.ok) {
            throw new Error(`Failed to add ingredients: ${response.statusText}`);
        }
        const newIngredients = await response.json();
        // Update SWR cache for ingredients
        await mutate('/ingredients');
        return newIngredients;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred while adding the ingredients.');
    }
}

export { useIngredients, addIngredients };