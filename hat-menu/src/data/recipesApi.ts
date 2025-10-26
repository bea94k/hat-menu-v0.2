import { useSupabaseQuery, useSupabaseMutation } from './useSupabaseQuery';
import type { Recipe } from '../schemas/supabase-helpers';

export function useRecipes() {
    const { data, error, isLoading } = useSupabaseQuery<Recipe>({
        table: 'recipe',
        select: '*',
    });

    return {
        recipes: data,
        isLoading,
        isError: error
    };
}

// NOTE: not implemented in data or frontend yet
export function useRecipesByCategory(category: string) {
    return useSupabaseQuery<Recipe>({
        table: 'recipe',
        select: '*',
        filters: { category },
    });
}

export function useRecipesMutation() {
    return useSupabaseMutation('recipe');
}
// TODO: fetch and create works, others not yet.
// TODO: old stuff sucks.

// Legacy functions for backward compatibility
// export async function addRecipe(recipe: RecipeForm): Promise<Recipe | null> {
//     const { mutate } = useSupabaseMutation<RecipeInsert>('recipe');
//     return await mutate('insert', recipe as RecipeInsert);
// }

// export async function updateRecipe(id: string, recipe: Partial<RecipeForm>): Promise<Recipe | null> {
//     const { mutate } = useSupabaseMutation<RecipeUpdate>('recipe');
//     return await mutate('update', recipe as RecipeUpdate, id);
// }

// export async function deleteRecipe(id: string): Promise<void> {
//     const { mutate } = useSupabaseMutation<Recipe>('recipe');
//     await mutate('delete', null, id);
// }
