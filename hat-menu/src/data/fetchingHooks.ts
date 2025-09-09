import useSWR from 'swr';
import fetcher from './fetcher';

const baseAPI = 'http://localhost:3000';

function useRecipes () {
    const { data, error, isLoading } = useSWR(`${baseAPI}/recipes`, fetcher);
 
    return {
        recipes: data,
        isLoading,
        isError: error
    };
}

export { useRecipes };