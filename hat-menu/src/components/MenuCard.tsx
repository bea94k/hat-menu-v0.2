import type { Menu } from '../schemas/Menus';

interface Props {
    menu: Menu;
}

const MenuCard = ({ menu }: Props) => (
    <div>
        Menu{' '} 
        <span style={{ fontWeight: 'bold' }}>{menu.startDate.slice(0, 10)}</span>
        {' '}to{' '}
        <span style={{ fontWeight: 'bold' }}>{menu.endDate.slice(0, 10)}</span>
        <ol>
            {menu.recipes.map(recipe => (
                <li key={recipe}>Recipe ID: {recipe}</li>
            ))}
        </ol>
    </div>
);

export default MenuCard;