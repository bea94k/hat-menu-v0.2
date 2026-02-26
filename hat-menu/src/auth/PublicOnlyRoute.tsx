import { Navigate, Outlet } from 'react-router';
import { useAuth } from './useAuth';

const PublicOnlyRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>loading...</div>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PublicOnlyRoute;