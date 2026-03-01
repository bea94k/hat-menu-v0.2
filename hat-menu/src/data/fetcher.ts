import { supabase } from '../supabase-config';

type AllowedTables = 'recipe' | 'menu' | 'menu_recipe' | 'suggested_ingredient' | 'recipe_ingredient';

const fetcher = async (url: string) => {
    const table = url.split('/')[1] as AllowedTables;
    const { data, error } = await supabase
        .from(table)
        .select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

const fetcherWithFilters = async (url: string) => {
    const table = url.split('/')[1] as AllowedTables;
    const { data, error } = await supabase
        .from(table)
        .select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export { fetcher, fetcherWithFilters };
