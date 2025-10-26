import { supabase } from '../supabase-config';

// Generic fetcher for Supabase queries
const fetcher = async (url: string) => {
    const { data, error } = await supabase
        .from(url.split('/')[1]) // Extract table name from URL
        .select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

// Specific fetchers for different operations
const fetcherWithFilters = async (url: string) => {
    const [table] = url.split('/').slice(1);
    const { data, error } = await supabase
        .from(table)
        .select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export { fetcher, fetcherWithFilters };
