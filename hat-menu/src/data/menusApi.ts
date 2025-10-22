import { useSupabaseQuery, useSupabaseMutation } from './useSupabaseQuery';
import type { Menu, MenuForm } from '../schemas/Menus';

function useMenus() {
    const { data, error, isLoading } = useSupabaseQuery<Menu>({
        table: 'menu',
        select: '*',
        realtime: true,
    });

    return {
        menus: data,
        isLoading,
        isError: error
    };
}

export function useMenusMutation() {
    return useSupabaseMutation<Menu>('menu');
}

async function addMenu(menu: MenuForm): Promise<Menu | null> {
    const newMenuRecipeIDs = menu.recipes?.map(recipe => recipe.id);
    const menuData = { ...menu, recipes: newMenuRecipeIDs };

    const { mutate } = useSupabaseMutation<Menu>('menu');
    return await mutate('insert', menuData);
}

export { useMenus, addMenu };