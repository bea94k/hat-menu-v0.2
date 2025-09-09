import useSWR from 'swr';
import fetcher from './fetcher';
import type { Recipe } from '../types/Recipes';

const baseAPI = 'http://localhost:3000';

function useRecipes () {
    const { data, error, isLoading } = useSWR<Recipe[]>(`${baseAPI}/recipes`, fetcher);
 
    return {
        recipes: data,
        isLoading,
        isError: error
    };
}

export { useRecipes };