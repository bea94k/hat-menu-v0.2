import { useState } from 'react';
import { useMenus } from '../data/menusApi';
import { useRecipes } from '../data/recipesApi';
import { getUniqueRandom } from '../utils/utils';
import type { Recipe } from '../types/Recipes';

const CreateMenuPage = () => {
    const { menus, isLoading, isError } = useMenus();
    const { recipes } = useRecipes();

    const [newMenu, setNewMenu] = useState<Recipe[]>([]);

    const getRandomMenu = () => {
        setNewMenu(getUniqueRandom(7, recipes || []));
    };

    return (
        <main id="maincontent">
            <h1>create a menu here</h1>
            <button onClick={() => getRandomMenu()}>Get 7 random recipes</button>
            <p>{newMenu.map(recipe => recipe.name).join(', ')}</p>

            <h2>Past menus (total: {menus?.length || 0})</h2>
            {
                isError ? (<div>failed to load</div>)
                    : isLoading ? (<div>loading...</div>) : 
                        menus && menus.length > 0 ? (
                            <ul>
                                {menus.map(menu => (
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
