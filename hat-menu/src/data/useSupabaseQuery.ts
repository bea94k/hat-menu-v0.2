import useSWR, { mutate as mutateSWR } from 'swr';
import { supabase } from '../supabase-config';

type AllowedTables = 'recipe' | 'menu' | 'menu_recipe';

interface UseSupabaseQueryOptions {
    table: AllowedTables;
    select?: string;
    filters?: Record<string, any>;
}

/**
 * Custom hook that combines SWR with Supabase for optimal caching
 */
export function useSupabaseQuery<T = any>(
    options: UseSupabaseQueryOptions
) {
    const { table, select = '*', filters = {} } = options;

    // Create a unique key for SWR
    const swrKey = `/${table}?${JSON.stringify({ select, filters })}`;

    // Fetcher function for SWR
    const fetcher = async () => {
        let query = supabase.from(table).select(select);

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            query = query.eq(key, value);
        });

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return data;
    };

    const { data, error, isLoading, mutate: swrMutate } = useSWR<T[]>(swrKey, fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
    });

    return {
        data,
        error,
        isLoading,
        mutate: swrMutate,
    };
}

/**
 * Hook for mutations with optimistic updates
 */
export function useSupabaseMutation(table: AllowedTables) {
    const mutate = async (operation: 'insert' | 'update' | 'delete', data: any, id: string) => {
        let query;

        switch (operation) {
            case 'insert':
                // NOTE: use "NEW" as id for 'create' queries
                query = supabase.from(table).insert([data]).select();
                break;
            case 'update':
                query = supabase.from(table).update(data).eq('id', id).select();
                break;
            case 'delete':
                query = supabase.from(table).delete().eq('id', id);
                break;
        }

        const { data: result, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        // Revalidate all queries for this table
        await mutateSWR(`/${table}`);

        return result;
    };

    return { mutate };
}
