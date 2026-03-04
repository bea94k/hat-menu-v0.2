import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/styleUtils';

type ButtonVariant = 'primary' | 'outline';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
};

const Button = ({ className, type = 'button', variant = 'primary', ...props }: ButtonProps) => {
    return (
        <button
            type={type}
            className={cn(
                'min-h-10 rounded-md px-4 py-2',
                'transition-colors', 
                'disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:border-gray-400',
                variant === 'primary' && 'bg-primary-500 text-white hover:bg-primary-700',
                variant === 'outline' && 'border border-primary-500 bg-white text-primary-500 hover:bg-gray-100',
                className)}
            {...props}
        />
    );
};

export default Button;