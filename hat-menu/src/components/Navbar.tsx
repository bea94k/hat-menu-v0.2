import { NavLink } from 'react-router';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/useAuth';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, loading, signOut } = useAuth();

    const handleSignOut = async () => {
        const error = await signOut();

        if (error) {
            console.error('Sign out failed:', error.message);
            return;
        }

        navigate('/sign-in', { replace: true });
    };

    return (
        <nav>
            <ul>
                {!loading && user && (
                    <>
                        <li>
                            <NavLink to="/">
                                Recipes
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/add-recipe">
                                Add Recipe
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/menus">
                                Menus
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/create-menu">
                                Create Menu
                            </NavLink>
                        </li>
                        <li>
                            <button type="button" onClick={handleSignOut}>
                                Sign out
                            </button>
                        </li>
                    </>
                )}

                {!loading && !user && (
                    <>
                        <li>
                            <NavLink to="/sign-in">
                                Sign In
                            </NavLink>
                        </li>
                    </>
                )}

            </ul>
        </nav>
    );
};

export default Navbar;
