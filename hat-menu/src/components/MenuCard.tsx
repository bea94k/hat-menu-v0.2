import { format, addDays } from 'date-fns';
import type { Menu } from '../schemas/Menus';

interface Props {
    menu: Menu;
}

const MenuCard = ({ menu }: Props) => {
    const startDate = menu.startDate;
    
    return (
        <div>
            Menu{' '}
            <span style={{ fontWeight: 'bold' }}>{startDate && format(startDate, 'd MMM yyyy')}</span>
            {' '}to{' '}
            <span style={{ fontWeight: 'bold' }}>{menu.endDate && format(menu.endDate, 'd MMM yyyy')}</span>
            <ol>
                {menu.recipes.map((recipe, i) => {
                    const date = startDate ? addDays(startDate, i) : null;
                    const weekday = date ? format(date, 'EEE') : '';
                    return (
                        <li key={`${recipe.id}-${i}`}>
                            {weekday && <span style={{ fontWeight: 'bold' }}>{weekday}:</span>} {recipe.name}
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export default MenuCard;