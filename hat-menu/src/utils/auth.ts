import { supabase } from '../supabase-config';

export async function checkAuthenticatedSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        throw new Error('Authentication check failed. Please sign in again.');
    }

    if (!data.session) {
        throw new Error('You must be signed in to perform this action.');
    }
}
