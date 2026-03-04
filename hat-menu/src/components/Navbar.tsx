import { useNavigate } from 'react-router';
import { useAuth } from '../auth/useAuth';
import NavbarLink from './NavbarLink';
import Button from './Button';

const Navbar = () => {
    const navigate = useNavigate();
    const { loading, signOut } = useAuth();

    const handleSignOut = async () => {
        const error = await signOut();

        if (error) {
            console.error('Sign out failed:', error.message);
            return;
        }

        navigate('/sign-in', { replace: true });
    };

    if (loading) {
        return null;
    }

    return (
        <header className="w-full">
            <nav aria-label="Account" className="h-10 w-full bg-primary-500 text-white">
                <ul className="flex h-full justify-end">
                    <li className="h-full">
                        <Button
                            onClick={handleSignOut}
                            className="h-full min-h-0 rounded-none px-4"
                        >
                            Log out
                        </Button>
                    </li>
                </ul>
            </nav>

            <nav aria-label="Main" className="fixed right-0 bottom-0 left-0 z-50 w-full bg-gray-200 px-0 py-0 text-gray-700">
                <ul className="m-0 flex items-stretch divide-x divide-gray-400">
                    <li className="flex-1">
                        <NavbarLink to="/" end>
                            All recipes
                        </NavbarLink>
                    </li>
                    <li className="flex-1">
                        <NavbarLink to="/add-recipe">
                            New recipe
                        </NavbarLink>
                    </li>
                    <li className="flex-1">
                        <NavbarLink to="/menus" end>
                            All menus
                        </NavbarLink>
                    </li>
                    <li className="flex-1">
                        <NavbarLink to="/create-menu">
                            New menu
                        </NavbarLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
