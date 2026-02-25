import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../auth/useAuth';
import { AuthSchema, type AuthForm } from '../schemas/Auth';

const SignUpPage = () => {
    const navigate = useNavigate();
    const { signUp } = useAuth();
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
        const error = await signUp(email, password);

        if (error) {
            setSubmitError(error.message);
            return;
        }

        navigate('/');
    };

    return (
        <main id="maincontent">
            <h1>Sign up</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="sign-up-email">Email</label>
                    <input
                        id="sign-up-email"
                        type="email"
                        autoComplete="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                        {...register('email')}
                    />
                    {errors.email?.message && <p>{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="sign-up-password">Password</label>
                    <input
                        id="sign-up-password"
                        type="password"
                        autoComplete="new-password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                        {...register('password')}
                    />
                    {errors.password?.message && <p>{errors.password.message}</p>}
                </div>

                {submitError && (
                    <p role="alert" aria-live="assertive">
                        {submitError}
                    </p>
                )}

                <button type="submit" disabled={isSubmitting} className="px-3 py-2 border-2 border-black rounded-md bg-white">
                    {isSubmitting ? 'Signing up...' : 'Sign up'}
                </button>
            </form>

            <p>
                Already have an account? <Link to="/sign-in">Sign in</Link>
            </p>
        </main>
    );
};

export default SignUpPage;
