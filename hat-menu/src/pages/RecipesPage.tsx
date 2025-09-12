import RecipeCard from '../components/RecipeCard';
import { useRecipes } from '../data/recipesApi';

const RecipesPage = () => {
    const { recipes, isLoading, isError } = useRecipes();
    if (isError) return <div>failed to load</div>;
    if (isLoading) return <div>loading...</div>;

    return (
        <main id="maincontent">
            <h1>browsing recipes here</h1>
            <ul>
                {(!recipes || recipes.length === 0) ? (
                    <li>No recipes available</li>
                ) : (
                
                    recipes.map(recipe => (
                        <li key={recipe.id}>
                            <RecipeCard recipe={recipe} />
                        </li>
                    )))}
            </ul>
        </main>
    );
};

export default RecipesPage;
