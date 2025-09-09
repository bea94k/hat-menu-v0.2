import React from 'react';
import { useRecipes } from '../data/fetchingHooks';

const RecipesPage: React.FC = () => {
    const { recipes, isLoading, isError } = useRecipes();
    if (isError) return <div>failed to load</div>;
    if (isLoading) return <div>loading...</div>;

    return (
        <main id="maincontent">
            <h1>browsing recipes here</h1>
            <p> first recipe: {recipes?.[0]?.name}</p>
        </main>
    );
};

export default RecipesPage;
