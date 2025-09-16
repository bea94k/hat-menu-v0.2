import { useState } from 'react';
import { addMenu, useMenus } from '../data/menusApi';
import { useRecipes } from '../data/recipesApi';
import { getUniqueRandom } from '../utils/utils';
import type { Recipe } from '../types/Recipes';

const CreateMenuPage = () => {
    const { menus, isLoading, isError } = useMenus();
    const { recipes } = useRecipes();

    const latestMenus = menus ? menus.slice(-3).reverse() : [];

    const [newMenu, setNewMenu] = useState<Recipe[]>([]);
    const [savingStatus, setSavingStatus] = useState('');

    const getRandomMenu = () => {
        setSavingStatus('');
        setNewMenu(getUniqueRandom(7, recipes || []));
    };

    const saveMenu = async (newMenu: Recipe[]) => {
        setSavingStatus('Saving...');
        if (newMenu.length === 0) {
            setSavingStatus('First randomize some recipes into a menu');
            return;
        }
        try {
            const newMenuRecipeIDs = newMenu.map(recipe => recipe.id);
            const response = await addMenu({recipes: newMenuRecipeIDs});
            setSavingStatus(`Menu saved! with ID: ${response?.id}`);
            setNewMenu([]);
        } catch (error: unknown) {
            console.error('Error saving menu:', error);
            setSavingStatus('An error occurred while saving the menu.');
        }
    };

    return (
        <main id="maincontent">
            <h1>create a menu here</h1>
            <button onClick={() => getRandomMenu()}>Get 7 random recipes</button>
            <p>{newMenu.map(recipe => recipe.name).join(', ')}</p>
            {newMenu.length > 0 && 
                <button onClick={() => saveMenu(newMenu)}>Save this menu</button>
            }
            {savingStatus && (
                <div style={{ border: '5px solid black', padding: '1rem' }}>
                    <p>{savingStatus}</p>
                </div>
            )}

            <h2>Latest 3 menus</h2>
            {
                isError ? (<div>failed to load</div>)
                    : isLoading ? (<div>loading...</div>) : 
                        menus && menus.length > 0 ? (
                            <ul>
                                {latestMenus.map(menu => (
                                    <li key={menu.id}>
                                        Menu (ID: {menu.id})
                                        <ul>
                                            {menu.recipes.map(recipe => (
                                                <li key={recipe}>Recipe ID: {recipe}</li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No menus available</p>
                        )
            }
        </main>
    );
};

export default CreateMenuPage;
