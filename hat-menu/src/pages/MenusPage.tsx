import MenuCard from '../components/MenuCard';
import PageWrapper from '../components/PageWrapper';
import { useMenus } from '../data/menusApi';

const MenusPage = () => {
    const { menus, isLoading, isError } = useMenus();
    if (isError) return <PageWrapper title="Past menus">failed to load</PageWrapper>;
    if (isLoading) return <PageWrapper title="Past menus">loading...</PageWrapper>;

    return (
        <PageWrapper title={`Past menus (total: ${menus?.length || 0})`}>
            {menus && menus.length > 0 ? (
                <ul>
                    {menus.reverse().map(menu => (
                        <li key={menu.id}>
                            <MenuCard menu={menu} />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No menus available</p>
            )}
        </PageWrapper>
    );
};

export default MenusPage;
