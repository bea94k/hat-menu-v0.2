import type { ComponentPropsWithRef } from 'react';
import { cn } from '../../utils/styleUtils';

type SelectProps = ComponentPropsWithRef<'select'> & {
    hasError?: boolean;
};

const Select = ({ className, hasError = false, ...props }: SelectProps) => {
    const ariaInvalid = props['aria-invalid'] ?? (hasError || undefined);

    return (
        <select
            aria-invalid={ariaInvalid}
            className={cn(
                // NOTE: the styles should be kept quite matching the Input component
                'w-full min-h-10 rounded-md border bg-white px-3 py-2 text-sm leading-5 text-gray-900',
                'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
                hasError
                    ? 'border-red-500'
                    : 'border-gray-300',
                className,
            )}
            {...props}
        />
    );
};

export default Select;