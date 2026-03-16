import type { ComponentPropsWithRef } from 'react';
import { cn } from '../../utils/styleUtils';

type LabelProps = Omit<ComponentPropsWithRef<'label'>, 'htmlFor'> & {
    htmlFor: string;
};

const Label = ({ className, htmlFor, ...props }: LabelProps) => {
    return (
        <label
            htmlFor={htmlFor}
            className={cn(
                'text-gray-800',
                'block mb-1', // Ensure label is on its own line
                className,
            )}
            {...props}
        />
    );
};

export default Label;
