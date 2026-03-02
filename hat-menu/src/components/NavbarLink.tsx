import type { ReactNode } from 'react';
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
            className={({ isActive }) =>
                `flex min-h-10 w-full items-center justify-center whitespace-nowrap px-1 py-2 text-sm no-underline transition-colors hover:bg-gray-300 focus-visible:bg-gray-300 ${isActive ? 'border-t-2 border-gray-400 bg-gray-300' : ''}`
            }
        >
            {children}
        </NavLink>
    );
};

export default NavbarLink;