import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { AuthContext, type AuthContextValue } from './AuthContext';
import { supabase } from '../supabase-config';

type AuthProviderProps = {
    children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const initializeSession = async () => {
            const { data } = await supabase.auth.getSession();

            if (!isMounted) {
                return;
            }

            setSession(data.session ?? null);
            setLoading(false);
        };

        void initializeSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, updatedSession) => {
            setSession(updatedSession ?? null);
            setLoading(false);
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signIn = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error;
    }, []);

    const signUp = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({ email, password });
        return error;
    }, []);

    const signOut = useCallback(async () => {
        const { error } = await supabase.auth.signOut();
        return error;
    }, []);

    const value = useMemo<AuthContextValue>(() => {
        return {
            session,
            user: session?.user ?? null,
            loading,
            signIn,
            signUp,
            signOut,
        };
    }, [loading, session, signIn, signOut, signUp]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;