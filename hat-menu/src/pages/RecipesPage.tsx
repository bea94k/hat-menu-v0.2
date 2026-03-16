import RecipeCard from '../components/RecipeCard';
import PageWrapper from '../components/PageWrapper';
import { useRecipes } from '../data/recipesApi';

const RecipesPage = () => {
    const { recipes, isLoading, isError } = useRecipes();

    if (isError) return <PageWrapper title="All recipes"><div>failed to load</div></PageWrapper>;
    if (isLoading) return <PageWrapper title="All recipes"><div>loading...</div></PageWrapper>;

    return (
        <PageWrapper title="All recipes">
            <ul className='flex flex-col gap-4'>
                {(!recipes || recipes.length === 0) ? (
                    <li>No recipes available</li>
                ) : (

                    recipes?.map(recipe => (
                        <li key={recipe.id}>
                            <RecipeCard recipe={recipe} />
                        </li>
                    )))}
            </ul>
        </PageWrapper>
    );
};

export default RecipesPage;
