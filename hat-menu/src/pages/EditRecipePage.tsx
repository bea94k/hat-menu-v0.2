import { useParams } from 'react-router';
import PageWrapper from '../components/PageWrapper';
import EditRecipeForm from '../components/EditRecipeForm';
import { useRecipe } from '../data/recipesApi';

const EditRecipePage = () => {
    const { id } = useParams<{ id: string }>();
    const { recipe, isLoading, isError } = useRecipe(id ?? '');
    const isRecipeNotFound = !isLoading && !isError && !recipe;

    return (
        <PageWrapper title="Edit recipe" backUrl="/">
            {isLoading && <p>Loading recipe…</p>}
            {isError && <p>Failed to load recipe.</p>}
            {isRecipeNotFound && (
                <div className="grid gap-2 rounded-md border border-gray-200 bg-white p-4">
                    <p className="text-lg font-medium">Recipe not found</p>
                    <p>The recipe you tried to edit does not exist or is no longer available.</p>
                </div>
            )}
            {recipe && (
                <EditRecipeForm
                    recipe={recipe}
                />
            )}
        </PageWrapper>
    );
};

export default EditRecipePage;
