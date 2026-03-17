import type { ReactNode } from 'react';
import { cn } from '../utils/styleUtils';
import { NavLink } from 'react-router';

type NavbarLinkProps = {
    to: string;
    children: ReactNode;
    end?: boolean;
};

const NavbarLink = ({ to, children, end = false }: NavbarLinkProps) => {
    return (
        <NavLink
            to={to}
            end={end}
            style={{ color: '#000000', textDecoration: 'none' }} // Overwriting default link styles. Tailwind classes are weaker than global anchor style in index.css
            className={({ isActive }) => cn(
                'min-h-10 w-full px-1 py-2',
                'flex items-center justify-center',
                'whitespace-nowrap text-sm no-underline transition-colors',
                'hover:bg-gray-300 focus-visible:bg-gray-300',
                `${isActive ? 'border-t-2 border-gray-400 bg-gray-300' : ''}`
            )}
        >
            {children}
        </NavLink>
    );
};

export default NavbarLink;