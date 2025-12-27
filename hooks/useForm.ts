import { useForm as useRHF, UseFormProps, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

/**
 * Custom hook wrapping React Hook Form with Zod validation
 * 
 * @param schema - Zod schema for validation
 * @param options - Additional React Hook Form options
 * @returns React Hook Form instance
 * 
 * @example
 * ```typescript
 * const { control, handleSubmit, formState: { errors } } = useForm(medicationSchema, {
 *   defaultValues: {
 *     name: '',
 *     dosage: '',
 *   }
 * });
 * ```
 */
export function useForm<T extends FieldValues = FieldValues>(
    schema: ZodSchema<T>,
    options?: Omit<UseFormProps<T>, 'resolver'>
): UseFormReturn<T> {
    return useRHF<T>({
        ...options,
        resolver: zodResolver(schema),
        mode: options?.mode || 'onBlur', // Validate on blur by default
    });
}
