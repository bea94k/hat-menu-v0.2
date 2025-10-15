import { useMenus } from '../data/menusApi';
import CreateMenuForm from '../components/CreateMenuForm';
import MenuCard from '../components/MenuCard';

const CreateMenuPage = () => {
    const { menus, isLoading, isError } = useMenus();
    const latestMenus = menus ? menus.slice(-3).reverse() : [];

    return (
        <main id="maincontent">
            <h1>Create a menu</h1>

            <CreateMenuForm />

            <h2>Latest 3 menus</h2>
            {
                isError ? (<div>failed to load</div>)
                    : isLoading ? (<div>loading...</div>) : 
                        menus && menus.length > 0 ? (
                            <ul>
                                {latestMenus.map(menu => (
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

export default CreateMenuPage;
