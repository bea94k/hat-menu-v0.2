import { Fragment } from 'react';
import { format, addDays } from 'date-fns';
import { cn } from '../utils/styleUtils';
import type { Menu } from '../schemas/Menus';

interface Props {
    menu: Menu;
}

const MenuCard = ({ menu }: Props) => {
    const startDate = menu.startDate;
    
    return (
        <div className={cn(
            'grid grid-cols-[45px_minmax(0,1fr)]',
            'p-2 border border-primary-300 bg-white rounded-lg'
        )}>
            <p className='col-span-2 underline decoration-double decoration-primary-300'>{startDate && format(startDate, 'd MMM yyyy')} - {menu.endDate && format(menu.endDate, 'd MMM yyyy')}</p>

            {menu.recipes.map((recipe, i) => {
                const date = startDate ? addDays(startDate, i) : null;
                const weekday = date ? format(date, 'EEE') : '';
                return (
                    <Fragment key={`${recipe.id}-${i}`}>
                        <p>{weekday}</p>
                        <p>{recipe.name}</p>
                    </Fragment>
                );
            })}
        </div>
    );
};

export default MenuCard;