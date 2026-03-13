import type { ComponentPropsWithRef } from 'react';
import { cn } from '../../utils/styleUtils';

type InputProps = ComponentPropsWithRef<'input'> & {
    hasError?: boolean;
};

const Input = ({ className, hasError = false, ref, type = 'text', ...props }: InputProps) => {
    const ariaInvalid = props['aria-invalid'] ?? (hasError || undefined);

    return (
        <input
            type={type}
            ref={ref}
            aria-invalid={ariaInvalid}
            className={cn(
                'w-full min-h-10 rounded-md border bg-white px-3 py-2 text-sm leading-5 text-gray-900',
                'placeholder:text-gray-400',
                'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
                'read-only:bg-gray-50 read-only:text-gray-600',
                hasError
                    ? 'border-red-500'
                    : 'border-gray-300',
                className,
            )}
            {...props}
        />
    );
};

export default Input;