import { cn } from '../../utils/styleUtils';

interface FormInputErrorProps {
    id: string;
    text: string;
    className?: string;
}

const FormInputError = ({
    id, // NOTE: this id should match the invalid input's aria-describedby
    text,
    className,
}: FormInputErrorProps) => {
    return (
        <p id={id} className={cn(
            'mt-1 text-sm text-red-600',
            className
        )}>
            {text}
        </p>
    );
};

export default FormInputError;