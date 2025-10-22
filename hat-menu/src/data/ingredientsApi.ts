import { useSupabaseQuery, useSupabaseMutation } from './useSupabaseQuery';
import type { NewSuggestedIngredient, SuggestedIngredient } from '../schemas/Ingredients';

function useSuggestedIngredients() {
    const { data, error, isLoading } = useSupabaseQuery<SuggestedIngredient>({
        table: 'ingredient',
        select: '*',
        realtime: true,
    });

    return {
        suggestedIngredients: data,
        isLoading,
        isError: error
    };
}

export function useSuggestedIngredientsMutation() {
    return useSupabaseMutation<SuggestedIngredient>('ingredient');
}

async function addSuggestedIngredients(ingredients: NewSuggestedIngredient): Promise<SuggestedIngredient[] | null> {
    const { mutate } = useSupabaseMutation<SuggestedIngredient>('ingredient');
    return await mutate('insert', ingredients);
}

export { useSuggestedIngredients, addSuggestedIngredients };