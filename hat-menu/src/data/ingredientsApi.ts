import { useSupabaseQuery, useSupabaseMutation } from './useSupabaseQuery';
import type { SuggestedIngredient, SuggestedIngredientInsert } from '../schemas/supabase-helpers';

/**
 * Hook to fetch all suggested ingredients for autocomplete
 * Results are sorted alphabetically by name
 */
export function useSuggestedIngredients() {
    const { data, error, isLoading } = useSupabaseQuery<SuggestedIngredient>({
        table: 'suggested_ingredient',
        select: '*',
    });

    // Sort alphabetically by name for better UX in autocomplete
    const sortedData = data?.sort((a, b) => a.name.localeCompare(b.name));

    return {
        ingredients: sortedData,
        isLoading,
        isError: error
    };
}

/**
 * Hook for adding new suggested ingredients on the fly
 * Useful when user enters a custom ingredient not in the autocomplete list
 */
export function useAddSuggestedIngredient() {
    const { mutate } = useSupabaseMutation('suggested_ingredient');

    /**
     * Add a new ingredient to the suggestions list
     * @param name - Ingredient name (must be singular, lowercase per conventions)
     */
    const addIngredient = async (name: string): Promise<SuggestedIngredient | null> => {
        const ingredientData: SuggestedIngredientInsert = {
            name: name.toLowerCase().trim(), // Enforce lowercase convention
        };

        const result = await mutate('insert', ingredientData, 'NEW') as SuggestedIngredient[];
        return result?.[0] ?? null;
    };

    return {
        addIngredient
    };
}
