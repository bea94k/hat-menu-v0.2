import { useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type Resolver, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { RecipeFormSchema, type RecipeForm } from '../schemas/Recipes';
import { IngredientsListInput } from './IngredientsListInput';
import { isSessionError } from '../utils/auth';
import Button from './primitives/Button';
import FormInputError from './primitives/FormInputError';
import Input from './primitives/Input';
import Label from './primitives/Label';

interface RecipeFormBaseProps {
    defaultValues: RecipeForm;
    onFormSubmit: (data: RecipeForm) => Promise<string>;
    submitButtonText: string;
    errorMessage: string;
    resetOnSuccess?: boolean;
}

const RecipeFormBase = ({ defaultValues, onFormSubmit, submitButtonText, errorMessage, resetOnSuccess }: RecipeFormBaseProps) => {
    const nameInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const {
        register,
        control,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RecipeForm>({
        resolver: yupResolver(RecipeFormSchema) as Resolver<RecipeForm>,
        defaultValues,
    });

    const [submitStatus, setSubmitStatus] = useState<string | null>(null);

    const onSubmit: SubmitHandler<RecipeForm> = async (data) => {
        setSubmitStatus('Saving...');
        try {
            const successMessage = await onFormSubmit(data);
            setSubmitStatus(successMessage);

            if (resetOnSuccess) {
                reset();
                nameInputRef?.current?.focus();
            }
        } catch (error: unknown) {
            console.error('Error saving recipe:', error);

            if (isSessionError(error)) {
                navigate('/sign-in', { replace: true, state: { reason: 'session-expired' } });
                return;
            }

            setSubmitStatus(errorMessage);
        }
    };

    // to be able to use ref along with register, ref for focusing after submit
    const { ref, ...rest } = register('name');

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <div>
                <Label htmlFor="recipe-name">Recipe Name:</Label>
                <Input
                    id="recipe-name"
                    aria-describedby={errors.name && 'error-name'}
                    hasError={!!errors.name}
                    autoComplete="off"
                    required
                    disabled={isSubmitting}
                    {...rest}
                    ref={(e) => {
                        ref(e);
                        nameInputRef.current = e;
                    }}
                />
                {errors.name && (
                    <FormInputError
                        id="error-name"
                        text={errors.name.message ?? 'Invalid input'}
                    />
                )}
            </div>
            <div>
                <Label htmlFor="recipe-url">Recipe URL (optional):</Label>
                <Input
                    id="recipe-url"
                    aria-describedby={errors.url && 'error-url'}
                    hasError={!!errors.url}
                    autoComplete="off"
                    disabled={isSubmitting}
                    {...register('url')}
                />
                {errors.url && (
                    <FormInputError
                        id="error-url"
                        text={errors.url.message ?? 'Invalid input'}
                    />
                )}
            </div>

            <IngredientsListInput
                control={control}
                register={register}
                errors={errors.ingredients}
                disabled={isSubmitting}
            />

            <div className="flex items-center gap-2">
                <input
                    id="ready-for-production"
                    type="checkbox"
                    disabled={isSubmitting}
                    {...register('ready_for_production')}
                    className="h-4 w-4 rounded border-gray-300 text-primary-500"
                />
                <Label htmlFor="ready-for-production" className="mb-0">
                    Ready for production
                </Label>
            </div>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : submitButtonText}
            </Button>

            <div role="status">
                {submitStatus && (
                    <div className='border-2 border-primary-300 rounded-md p-2 bg-primary-100'>
                        <p>{submitStatus}</p>
                    </div>
                )}
            </div>
        </form>
    );
};

export default RecipeFormBase;
