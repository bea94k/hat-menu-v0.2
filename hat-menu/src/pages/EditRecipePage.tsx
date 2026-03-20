import { useParams, useNavigate } from 'react-router';
import PageWrapper from '../components/PageWrapper';
import Button from '../components/primitives/Button';

const EditRecipePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    return (
        <PageWrapper title="Edit recipe">
            <Button
                onClick={() => navigate('/')}
                variant='outline'
                className="w-fit"
            >
                    ← Back to recipes
            </Button>

            <p>
                    ID: {id} 
            </p>
        </PageWrapper>
    );
};

export default EditRecipePage;
