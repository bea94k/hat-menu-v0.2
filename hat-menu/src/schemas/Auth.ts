import { object, string, type InferType } from 'yup';

const AuthSchema = object({
    email: string().email('Enter a valid email address').required('Email is required'),
    password: string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

type AuthForm = InferType<typeof AuthSchema>;

export { AuthSchema };
export type { AuthForm };
