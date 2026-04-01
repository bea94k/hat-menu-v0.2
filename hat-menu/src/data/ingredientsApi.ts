import { mutate as mutateSWR } from 'swr';
import { supabase } from '../supabase-config';
import { useSupabaseQuery } from './useSupabaseQuery';
import type { SuggestedIngredient, SuggestedIngredientInsert } from '../schemas/supabase-helpers';
import { normalizeUniqueStrings } from '../utils/utils';

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
 * Add new suggested ingredients to the database
 * When creating or updating recipe and an ingredient is not yet in the suggestions/autocomplete list
 * @param names - array of ingredient names, will be normalized to lowercase and trimmed before insertion
 */

export async function syncSuggestedIngredients(names: string[]): Promise<void> {
    const normalizedNames = normalizeUniqueStrings(names);

    if (normalizedNames.length === 0) {
        return;
    }

    const ingredientData: SuggestedIngredientInsert[] = normalizedNames.map(name => ({ name }));

    const { error } = await supabase
        .from('suggested_ingredient')
        .upsert(ingredientData, {
            onConflict: 'name',
            ignoreDuplicates: true,
        });

    if (error) {
        throw new Error(error.message);
    }

    await mutateSWR(
        (key) => typeof key === 'string' && key.startsWith('/suggested_ingredient?')
    );
}
