import useSWR, { mutate } from 'swr';
import { baseAPI, fetcher } from './fetcher';
import type { Menu, MenuForm } from '../types/Menus';

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
        const response = await fetch(`${baseAPI}/menus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(menu),
        });
        if (!response.ok) {
            throw new Error(`Failed to add menu: ${response.statusText}`);
        }
        const newMenu = await response.json();
        // Update SWR cache for menus
        await mutate('/menus');
        return newMenu;
    } catch (error) {
        console.error('Error adding menu:', error);
        return null;
    }
}

export { useMenus, addMenu };