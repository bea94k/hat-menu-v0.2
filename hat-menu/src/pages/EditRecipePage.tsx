import { useParams, useNavigate } from 'react-router';
import PageWrapper from '../components/PageWrapper';
import Button from '../components/primitives/Button';
import { useRecipe } from '../data/recipesApi';

const EditRecipePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { recipe, isLoading, isError } = useRecipe(id!);

    return (
        <PageWrapper title="Edit recipe">
            <Button
                onClick={() => navigate('/')}
                variant='outline'
                className="w-fit"
            >
                    ← Back to recipes
            </Button>

            {isLoading && <p>Loading recipe…</p>}
            {isError && <p>Failed to load recipe.</p>}
            {recipe && (
                <div>
                    <p>ID: {recipe.id}</p>
                    <p>Name: {recipe.name}</p>
                    {recipe.url && <p>URL: {recipe.url}</p>}
                </div>
            )}
        </PageWrapper>
    );
};

export default EditRecipePage;
