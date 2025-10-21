import RecipeCard from '../components/RecipeCard';
import { useRecipes } from '../data/recipesApi';

const RecipesPage = () => {
    const { data, isLoading, error } = useRecipes();

    if (error) return <div>failed to load</div>;
    if (isLoading) return <div>loading...</div>;

    return (
        <main id="maincontent">
            <h1>browsing recipes here</h1>
            <ul>
                {(!data || data.length === 0) ? (
                    <li>No recipes available</li>
                ) : (

                    data?.map(recipe => (
                        <li key={recipe.id}>
                            <RecipeCard recipe={recipe} />
                        </li>
                    )))}
            </ul>
        </main>
    );
};

export default RecipesPage;
