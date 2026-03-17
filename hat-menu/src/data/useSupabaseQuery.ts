import useSWR, { mutate as mutateSWR } from 'swr';
import { supabase } from '../supabase-config';
import { checkAuthenticatedSession } from '../utils/auth';

type AllowedTables = 'recipe' | 'menu' | 'menu_recipe' | 'suggested_ingredient' | 'recipe_ingredient';
type FilterValue = string | number | boolean | null;

interface UseSupabaseQueryOptions {
    table: AllowedTables;
    select?: string;
    filters?: Record<string, FilterValue>;
}

/**
 * Custom hook that combines SWR with Supabase for optimal caching
 */
export function useSupabaseQuery<T>(
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
            if (value === null) {
                query = query.is(key, null);
                return;
            }

            query = query.eq(key, value);
        });

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return data as T[];
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
    const mutate = async (
        operation: 'insert' | 'update' | 'delete',
        data: unknown,
        id: string
    ) => {
        await checkAuthenticatedSession();

        let query;

        switch (operation) {
        case 'insert':
            // NOTE: insert ignores `id`; callers pass "NEW" as a placeholder to match the shared mutate signature.
            query = supabase.from(table).insert([data as never]).select();
            // NOTE: `data` can have different shapes depending on the table and operation.
            // TypeScript can't figure out the exact shape at this point, even though runtime logic is correct.
            // We use `as never` here only to satisfy Supabase's strict TypeScript overloads.
            break;
        case 'update':
            query = supabase.from(table).update(data as never).eq('id', id).select();
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
