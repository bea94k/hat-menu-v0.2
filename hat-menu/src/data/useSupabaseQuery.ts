import { useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { supabase } from '../supabase-config';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface UseSupabaseQueryOptions {
    table: string;
    select?: string;
    filters?: Record<string, any>;
    realtime?: boolean;
}

/**
 * Custom hook that combines SWR with Supabase for optimal caching and real-time updates
 */
export function useSupabaseQuery<T = any>(
    options: UseSupabaseQueryOptions
) {
    const { table, select = '*', filters = {}, realtime = true } = options;

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

    // Set up real-time subscription
    useEffect(() => {
        if (!realtime) return;

        const channel = supabase
            .channel(`${table}-changes`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: table,
                },
                (payload: RealtimePostgresChangesPayload<any>) => {
                    console.log('Real-time update received:', payload);

                    // Revalidate the SWR cache when data changes
                    swrMutate();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [table, realtime, swrMutate]);

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
export function useSupabaseMutation<T = any>(table: string) {
    const mutate = async (operation: 'insert' | 'update' | 'delete', data: any, id?: string) => {
        let query;

        switch (operation) {
            case 'insert':
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
        await mutate(`/${table}`);

        return result;
    };

    return { mutate };
}
