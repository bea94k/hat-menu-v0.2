import { useSupabaseQuery, useSupabaseMutation } from './useSupabaseQuery';
import type { Recipe, RecipeForm } from '../schemas/Recipes';

/**
 * Enhanced recipes API using the new Supabase + SWR hooks
 */
export function useRecipes() {
    return useSupabaseQuery<Recipe>({
        table: 'recipes',
        select: '*',
        realtime: true, // Enable real-time updates
    });
}

export function useRecipesByCategory(category: string) {
    return useSupabaseQuery<Recipe>({
        table: 'recipes',
        select: '*',
        filters: { category },
        realtime: true,
    });
}

export function useRecipesMutation() {
    return useSupabaseMutation<Recipe>('recipes');
}

// Legacy functions for backward compatibility
export async function addRecipe(recipe: RecipeForm): Promise<Recipe | null> {
    const { mutate } = useSupabaseMutation<Recipe>('recipes');
    return await mutate('insert', recipe);
}

export async function updateRecipe(id: string, recipe: Partial<RecipeForm>): Promise<Recipe | null> {
    const { mutate } = useSupabaseMutation<Recipe>('recipes');
    return await mutate('update', recipe, id);
}

export async function deleteRecipe(id: string): Promise<void> {
    const { mutate } = useSupabaseMutation<Recipe>('recipes');
    await mutate('delete', null, id);
}
