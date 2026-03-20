import { useParams } from 'react-router';
import PageWrapper from '../components/PageWrapper';
import { useRecipe } from '../data/recipesApi';

const EditRecipePage = () => {
    const { id } = useParams<{ id: string }>();
    const { recipe, isLoading, isError } = useRecipe(id!);

    console.log('Fetched recipe:', recipe);

    return (
        <PageWrapper title="Edit recipe" backUrl='/'>
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
