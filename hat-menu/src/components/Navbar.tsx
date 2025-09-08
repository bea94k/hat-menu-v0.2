import React from 'react';
import { NavLink } from 'react-router';

const Navbar: React.FC = () => {
    return (
        <nav>
            <ul>
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
                    <NavLink to="/create-menu">
                        Create Menu
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
