import { useState } from 'react';
import { addMenu, useMenus } from '../data/menusApi';
import { useRecipes } from '../data/recipesApi';
import { getUniqueRandom } from '../utils/utils';
import type { Recipe } from '../schemas/Recipes';

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

    const randomizeRecipeAtIndex = (index: number) => {
        if (!recipes || recipes.length === 0) return;
        const usedIds = newMenu.map(r => r.id);
        const unusedRecipes = recipes.filter(r => !usedIds.includes(r.id));
        if (unusedRecipes.length === 0) return;
        const randomRecipe = unusedRecipes[Math.floor(Math.random() * unusedRecipes.length)];
        setNewMenu(prevMenu => prevMenu.map((r, i) => i === index ? randomRecipe : r));
    };

    const moveRecipeUp = (index: number) => {
        if (index <= 0) return;
        setNewMenu(prevMenu => {
            const updatedMenu = [...prevMenu];
            [updatedMenu[index - 1], updatedMenu[index]] = [updatedMenu[index], updatedMenu[index - 1]];
            return updatedMenu;
        });
    };

    const moveRecipeDown = (index: number) => {
        if (index >= newMenu.length - 1) return;
        setNewMenu(prevMenu => {
            const updatedMenu = [...prevMenu];
            [updatedMenu[index], updatedMenu[index + 1]] = [updatedMenu[index + 1], updatedMenu[index]];
            return updatedMenu;
        });
    };

    return (
        <main id="maincontent">
            <h1>create a menu here</h1>
            <button onClick={() => getRandomMenu()}>Get 7 random recipes</button>

            <h2>Suggested menu</h2>
            <ol>
                {newMenu.map((recipe, index) => (
                    <li key={recipe.id}>
                        <button
                            onClick={() => moveRecipeUp(index)}
                            disabled={index === 0}
                            aria-label={`Move ${recipe.name} up`}
                        >
                            Move up
                        </button>
                        <button
                            onClick={() => moveRecipeDown(index)}
                            disabled={index === newMenu.length - 1}
                            aria-label={`Move ${recipe.name} down`}
                        >
                            Move down
                        </button>
                        <button
                            onClick={() => randomizeRecipeAtIndex(index)}
                            aria-label={`Change ${recipe.name}`}
                        >
                            Change
                        </button>
                        {recipe.name}
                    </li>
                ))}
            </ol>

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
                                        <ol>
                                            {menu.recipes.map(recipe => (
                                                <li key={recipe}>Recipe ID: {recipe}</li>
                                            ))}
                                        </ol>
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
