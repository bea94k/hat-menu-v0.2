import { useParams, useNavigate } from 'react-router';
import PageWrapper from '../components/PageWrapper';
import Button from '../components/primitives/Button';
import { useRecipe } from '../data/recipesApi';

const EditRecipePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { recipe, isLoading, isError } = useRecipe(id!);

    console.log('Fetched recipe:', recipe);

    return (
        <PageWrapper title="Edit recipe">
            <Button
                onClick={() => navigate('/')}
                variant='outline'
                className="w-fit"
            >
                Back to recipes
            </Button>

            {isLoading && <p>Loading...</p>}
            {isError && <p>Failed to load recipe.</p>}
            {recipe && (
                <>
                    <p>ID: {recipe.id}</p>
                    <p>Name: {recipe.name}</p>
                </>
            )}
        </PageWrapper>
    );
};

export default EditRecipePage;
