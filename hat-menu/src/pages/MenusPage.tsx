import MenuCard from '../components/MenuCard';
import { useMenus } from '../data/menusApi';

const MenusPage = () => {
    const { menus, isLoading, isError } = useMenus();
    if (isError) return <div>failed to load</div>;
    if (isLoading) return <div>loading...</div>;

    return (
        <main id="maincontent">
            <h1>Past menus (total: {menus?.length || 0})</h1>
            {
                isError ? (<div>failed to load</div>)
                    : isLoading ? (<div>loading...</div>) : 
                        menus && menus.length > 0 ? (
                            <ul>
                                {menus.reverse().map(menu => (
                                    <li key={menu.id}>
                                        <MenuCard menu={menu} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No menus available</p>
                        )
            }
        </main>
    );
};

export default MenusPage;
