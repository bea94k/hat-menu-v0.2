import { Navigate, Outlet } from 'react-router';
import { useAuth } from './useAuth';
import Navbar from '../components/Navbar';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>loading...</div>;
    }

    if (!user) {
        return <Navigate to="/sign-in" replace />;
    }

    return (
        <div className="pb-24">
            <Navbar />
            <Outlet />
        </div>
    );
};

export default ProtectedRoute;
