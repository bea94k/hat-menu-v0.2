import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../auth/useAuth';
import { AuthSchema, type AuthForm } from '../schemas/Auth';
import { mapAuthErrorMessage } from '../utils/auth';
import Button from '../components/primitives/Button';
import FormInputError from '../components/primitives/FormInputError';
import Input from '../components/primitives/Input';
import Label from '../components/primitives/Label';

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
        <main id="maincontent" className="w-full min-h-screen p-4 flex justify-center items-center">
            <div className="grid w-full max-w-2xl gap-6 justify-items-center">

                <div className="w-40 h-40 rounded-4xl flex justify-center items-center bg-primary-200 border border-primary-500/30">
                    <img
                        src="/favicon.svg"
                        alt="Hat Menu logo"
                        className="w-28 h-28 object-contain"
                    />
                </div>

                <h1 className="mb-1 pt-6 text-2xl leading-[1.2]">Sign in</h1>

                {routeError && <FormInputError id="error-route" text={routeError} />}

                <form noValidate onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md flex flex-col gap-4">
                    <div>
                        <Label htmlFor="sign-in-email">Email</Label>
                        <Input
                            id="sign-in-email"
                            type="email"
                            autoComplete="email"
                            aria-describedby={errors.email && 'error-email'}
                            hasError={!!errors.email}
                            disabled={isSubmitting}
                            {...register('email')}
                        />
                        {errors.email?.message && (
                            <FormInputError id="error-email" text={errors.email.message} />
                        )}
                    </div>

                    <div>
                        <Label htmlFor="sign-in-password">Password</Label>
                        <Input
                            id="sign-in-password"
                            type="password"
                            autoComplete="current-password"
                            aria-describedby={errors.password && 'error-password'}
                            hasError={!!errors.password}
                            disabled={isSubmitting}
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
            </div>
        </main>
    );
};

export default SignInPage;
