import { format } from 'date-fns';
import type { Menu } from '../schemas/Menus';

interface Props {
    menu: Menu;
}

const MenuCard = ({ menu }: Props) => (
    <div>
        Menu{' '} 
        <span style={{ fontWeight: 'bold' }}>{format(menu.startDate, 'd MMM yyyy')}</span>
        {' '}to{' '}
        <span style={{ fontWeight: 'bold' }}>{format(menu.endDate, 'd MMM yyyy')}</span>
        <ol>
            {menu.recipes.map(recipe => (
                <li key={recipe}>Recipe ID: {recipe}</li>
            ))}
        </ol>
    </div>
);

export default MenuCard;