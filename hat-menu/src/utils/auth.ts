import { supabase } from '../supabase-config';

type AuthErrorLike = {
    name?: string;
    status?: number;
    code?: string;
    message?: string;
};

type AuthAction = 'sign-in' | 'session';

export class SessionCheckFailedError extends Error {
    constructor() {
        super('Authentication check failed. Please sign in again.');
        this.name = 'SessionCheckFailedError';
    }
}

export class SessionRequiredError extends Error {
    constructor() {
        super('You must be signed in to perform this action.');
        this.name = 'SessionRequiredError';
    }
}

export async function checkAuthenticatedSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        throw new SessionCheckFailedError();
    }

    if (!data.session) {
        throw new SessionRequiredError();
    }
}

export function isSessionError(error: unknown) {
    return error instanceof SessionRequiredError || error instanceof SessionCheckFailedError;
}

export function mapAuthErrorMessage(error: AuthErrorLike | null, action: AuthAction) {
    const errorCode = error?.code?.toLowerCase();
    const errorStatus = error?.status;
    const errorName = error?.name;

    if (action === 'session') {
        return 'Your session is invalid or expired. Please sign in again.';
    }

    if (errorCode === 'email_not_confirmed') {
        return 'Your email is not verified yet. Please confirm your email before signing in.';
    }

    if (errorCode === 'invalid_credentials' || errorCode === 'invalid_login_credentials') {
        return 'Invalid email or password. Please try again.';
    }

    if (errorName === 'AuthRetryableFetchError') {
        return 'Unable to reach the authentication service. Please check your connection and try again.';
    }

    if (errorCode === 'over_request_rate_limit' || errorCode === 'over_email_send_rate_limit') {
        return 'Too many attempts. Please wait a moment and try again.';
    }

    if (errorStatus === 429) {
        return 'Too many attempts. Please wait a moment and try again.';
    }

    if (errorStatus !== undefined && errorStatus >= 500) {
        return 'Authentication service is temporarily unavailable. Please try again shortly.';
    }

    if (action === 'sign-in' && errorStatus === 400) {
        return 'Invalid email or password. Please try again.';
    }

    return 'Sign in failed. Please try again.';
}
