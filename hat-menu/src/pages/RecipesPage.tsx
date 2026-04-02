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
                // recipes?.map(...) -> original code
                // NOTE: temp sort so that not ready for prod are on top
                    [...recipes].sort((a, b) => Number(a.ready_for_production) - Number(b.ready_for_production)).map(recipe => (
                        <li key={recipe.id}>
                            <RecipeCard recipe={recipe} />
                        </li>
                    )))}
            </ul>
        </PageWrapper>
    );
};

export default RecipesPage;
