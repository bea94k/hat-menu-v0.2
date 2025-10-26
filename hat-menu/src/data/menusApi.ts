import { useSupabaseQuery, useSupabaseMutation } from './useSupabaseQuery';
import { supabase } from '../supabase-config';
import type { Menu, MenuInsert, MenuWithRecipes, MenuRecipeInsert } from '../schemas/supabase-helpers';
import type { MenuForm } from '../schemas/Menus';


function useMenus() {
    const { data, error, isLoading } = useSupabaseQuery<MenuWithRecipes>({
        table: 'menu',
        select: '*, menu_recipe(recipe(*))',
    });

    // Transform the data to match the expected Menu interface
    const transformedData = data?.map(menu => ({
        id: menu.id,
        startDate: menu.startDate,
        endDate: menu.endDate,
        created_at: menu.created_at,
        recipes: menu.menu_recipe?.map(mr => mr.recipe) || []
    }));

    return {
        menus: transformedData,
        isLoading,
        isError: error
    };
}

export function useMenusMutation() {
    return useSupabaseMutation('menu');
}

async function addMenu(menu: MenuForm): Promise<Menu | null> {
    try {
        // First, create the menu
        const { data: menuData, error: menuError } = await supabase
            .from('menu')
            .insert({
                startDate: menu.startDate.toISOString().split('T')[0],
                endDate: menu.endDate.toISOString().split('T')[0],
            })
            .select()
            .single();

        if (menuError) {
            throw new Error(menuError.message);
        }

        // Then, create the menu_recipe relationships
        if (menu.recipes && menu.recipes.length > 0) {
            const menuRecipeInserts: MenuRecipeInsert[] = menu.recipes.map(recipe => ({
                menu_id: menuData.id,
                recipe_id: recipe.id,
            }));

            const { error: menuRecipeError } = await supabase
                .from('menu_recipe')
                .insert(menuRecipeInserts);

            if (menuRecipeError) {
                throw new Error(menuRecipeError.message);
            }
        }

        const newlyCreatedMenu = {
            ...menuData,
            recipes: menu.recipes,
        };

        return newlyCreatedMenu;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred while adding the menu.');
    }
}

export { useMenus, addMenu };