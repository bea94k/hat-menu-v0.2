import { Navigate, Outlet } from 'react-router';
import { useAuth } from './useAuth';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>loading...</div>;
    }

    if (!user) {
        return <Navigate to="/sign-in" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
