import useSWR, { mutate } from 'swr';
import { baseAPI, fetcher } from './fetcher';
import type { Menu, MenuForm } from '../schemas/Menus';

function useMenus () {
    const { data, error, isLoading } = useSWR<Menu[]>('/menus', fetcher);
 
    return {
        menus: data,
        isLoading,
        isError: error
    };
}

async function addMenu(menu: MenuForm): Promise<Menu | null> {
    try {
        const newMenuRecipeIDs = menu.recipes?.map(recipe => recipe.id);
        const data = {...menu, recipes: newMenuRecipeIDs};
        const response = await fetch(`${baseAPI}/menus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Failed to add menu: ${response.statusText}`);
        }
        const newMenu = await response.json();
        // Update SWR cache for menus
        await mutate('/menus');
        return newMenu;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred while adding the menu.');
    }
}

export { useMenus, addMenu };