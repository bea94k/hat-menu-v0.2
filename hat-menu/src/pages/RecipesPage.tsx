import React from 'react';
import useSWR from 'swr';
import fetcher from '../data/fetcher';

const RecipesPage: React.FC = () => {
    const { data, error, isLoading } = useSWR('http://localhost:3000/recipes', fetcher);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <div>loading...</div>;
 


    return (
        <main id="maincontent">
            <h1>browsing recipes here</h1>
            <p> first recipe: {data[0].name}.</p>
        </main>
    );
};

export default RecipesPage;
