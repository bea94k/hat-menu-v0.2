import { createContext } from 'react';
import type { AuthError, Session, User } from '@supabase/supabase-js';

export type AuthContextValue = {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<AuthError | null>;
    signOut: () => Promise<AuthError | null>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
