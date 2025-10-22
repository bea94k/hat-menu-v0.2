import { useSupabaseQuery, useSupabaseMutation } from './useSupabaseQuery';
import type { Recipe, RecipeForm } from '../schemas/Recipes';

/**
 * Enhanced recipes API using the new Supabase + SWR hooks
 */
export function useRecipes() {
    const { data, error, isLoading } = useSupabaseQuery<Recipe>({
        table: 'recipe',
        select: '*',
        realtime: true, // Enable real-time updates
    });

    return {
        recipes: data,
        isLoading,
        isError: error
    };
}

export function useRecipesByCategory(category: string) {
    return useSupabaseQuery<Recipe>({
        table: 'recipe',
        select: '*',
        filters: { category },
        realtime: true,
    });
}

export function useRecipesMutation() {
    return useSupabaseMutation<Recipe>('recipe');
}

// Legacy functions for backward compatibility
export async function addRecipe(recipe: RecipeForm): Promise<Recipe | null> {
    const { mutate } = useSupabaseMutation<Recipe>('recipe');
    return await mutate('insert', recipe);
}

export async function updateRecipe(id: string, recipe: Partial<RecipeForm>): Promise<Recipe | null> {
    const { mutate } = useSupabaseMutation<Recipe>('recipe');
    return await mutate('update', recipe, id);
}

export async function deleteRecipe(id: string): Promise<void> {
    const { mutate } = useSupabaseMutation<Recipe>('recipe');
    await mutate('delete', null, id);
}
