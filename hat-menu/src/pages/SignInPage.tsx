import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../auth/useAuth';
import { AuthSchema, type AuthForm } from '../schemas/Auth';
import { mapAuthErrorMessage } from '../utils/auth';
import PageWrapper from '../components/PageWrapper';
import Button from '../components/primitives/Button';
import FormInputError from '../components/primitives/FormInputError';
import Input from '../components/primitives/Input';

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

            {routeError && <FormInputError id="error-route" text={routeError} />}

            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="sign-in-email">Email</label>
                    <Input
                        id="sign-in-email"
                        type="email"
                        autoComplete="email"
                        aria-describedby={errors.email && 'error-email'}
                        hasError={!!errors.email}
                        {...register('email')}
                    />
                    {errors.email?.message && (
                        <FormInputError id="error-email" text={errors.email.message} />
                    )}
                </div>

                <div>
                    <label htmlFor="sign-in-password">Password</label>
                    <Input
                        id="sign-in-password"
                        type="password"
                        autoComplete="current-password"
                        aria-describedby={errors.password && 'error-password'}
                        hasError={!!errors.password}
                        {...register('password')}
                    />
                    {errors.password?.message && (
                        <FormInputError id="error-password" text={errors.password.message} />
                    )}
                </div>

                {submitError && <FormInputError id="error-submit" text={submitError} />}

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>
            </form>
        </PageWrapper>
    );
};

export default SignInPage;
