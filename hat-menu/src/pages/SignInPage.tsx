import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../auth/useAuth';
import { AuthSchema, type AuthForm } from '../schemas/Auth';
import { mapAuthErrorMessage } from '../utils/auth';
import PageWrapper from '../components/PageWrapper';
import Button from '../components/Button';
import TextInput from '../components/TextInput';

const SignInPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signIn } = useAuth();
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AuthForm>({
        resolver: yupResolver(AuthSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<AuthForm> = async ({ email, password }) => {
        setSubmitError(null);
        const error = await signIn(email, password);

        if (error) {
            setSubmitError(mapAuthErrorMessage(error, 'sign-in'));
            return;
        }

        navigate('/');
    };

    const routeState = location.state as { reason?: string } | null;
    const routeError = routeState?.reason === 'session-expired'
        ? mapAuthErrorMessage(null, 'session')
        : null;

    return (
        <PageWrapper title="Sign in">

            {routeError && (
                <p className="mt-1 text-sm text-red-600" role="alert" aria-live="assertive">
                    {routeError}
                </p>
            )}

            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="sign-in-email">Email</label>
                    <TextInput
                        id="sign-in-email"
                        type="email"
                        autoComplete="email"
                        aria-describedby={errors.email ? 'error-email' : undefined}
                        aria-invalid={!!errors.email}
                        hasError={Boolean(errors.email)}
                        {...register('email')}
                    />
                    {errors.email?.message && (
                        <p id="error-email" className="mt-1 text-sm text-red-600" role="alert">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="sign-in-password">Password</label>
                    <TextInput
                        id="sign-in-password"
                        type="password"
                        autoComplete="current-password"
                        aria-describedby={errors.password ? 'error-password' : undefined}
                        aria-invalid={!!errors.password}
                        hasError={Boolean(errors.password)}
                        {...register('password')}
                    />
                    {errors.password?.message && (
                        <p id="error-password" className="mt-1 text-sm text-red-600" role="alert">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {submitError && (
                    <p className="mt-1 text-sm text-red-600" role="alert" aria-live="assertive">
                        {submitError}
                    </p>
                )}

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>
            </form>
        </PageWrapper>
    );
};

export default SignInPage;
