import { format } from 'date-fns';
import type { Menu } from '../schemas/Menus';

interface Props {
    menu: Menu;
}

const MenuCard = ({ menu }: Props) => (
    <div>
        Menu{' '}
        <span style={{ fontWeight: 'bold' }}>{menu.startDate && format(menu.startDate, 'd MMM yyyy')}</span>
        {' '}to{' '}
        <span style={{ fontWeight: 'bold' }}>{menu.endDate && format(menu.endDate, 'd MMM yyyy')}</span>
        <ol>
            {menu.recipes.map((recipe, i) => (
                <li key={`${recipe}-${i}`}>Recipe ID: {recipe.id}</li>
            ))}
        </ol>
    </div>
);

export default MenuCard;