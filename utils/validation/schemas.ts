import { z } from 'zod';

// ========================================
// Pet Schemas
// ========================================

export const petBasicInfoSchema = z.object({
    name: z.string()
        .min(1, 'Pet name is required')
        .max(50, 'Name must be less than 50 characters'),
    species: z.enum(['dog', 'cat', 'bird', 'rabbit', 'reptile', 'other'], {
        errorMap: () => ({ message: 'Please select a species' }),
    }),
    breed: z.string().optional(),
    gender: z.enum(['male', 'female'], {
        errorMap: () => ({ message: 'Please select a gender' }),
    }),
    dateOfBirth: z.date().optional(),
    weight: z.number()
        .positive('Weight must be positive')
        .optional(),
    weightUnit: z.enum(['kg', 'lbs']).default('kg'),
    microchipId: z.string().optional(),
    color: z.string().optional(),
    markings: z.string().optional(),
});

export type PetBasicInfo = z.infer<typeof petBasicInfoSchema>;

// ========================================
// Medication Schemas
// ========================================

export const medicationSchema = z.object({
    name: z.string()
        .min(1, 'Medication name is required')
        .max(100, 'Name must be less than 100 characters'),
    dosage: z.string()
        .min(1, 'Dosage is required')
        .max(50, 'Dosage must be less than 50 characters'),
    frequency: z.string()
        .min(1, 'Frequency is required'),
    startDate: z.date({
        required_error: 'Start date is required',
    }),
    endDate: z.date().optional(),
    prescribedBy: z.string().optional(),
    notes: z.string().optional(),
    reminderEnabled: z.boolean().default(true),
}).refine(data => {
    if (data.endDate && data.startDate) {
        return data.endDate >= data.startDate;
    }
    return true;
}, {
    message: 'End date must be after start date',
    path: ['endDate'],
});

export type Medication = z.infer<typeof medicationSchema>;

// ========================================
// Vaccination Schemas
// ========================================

export const vaccinationSchema = z.object({
    name: z.string()
        .min(1, 'Vaccination name is required')
        .max(100, 'Name must be less than 100 characters'),
    type: z.enum(['core', 'non_core', 'optional'], {
        errorMap: () => ({ message: 'Please select a type' }),
    }),
    date: z.date({
        required_error: 'Vaccination date is required',
    }),
    nextDueDate: z.date().optional(),
    veterinarian: z.string().optional(),
    clinicName: z.string().optional(),
    batchNumber: z.string().optional(),
    notes: z.string().optional(),
    certificateUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
}).refine(data => {
    if (data.nextDueDate && data.date) {
        return data.nextDueDate >= data.date;
    }
    return true;
}, {
    message: 'Next due date must be after vaccination date',
    path: ['nextDueDate'],
});

export type Vaccination = z.infer<typeof vaccinationSchema>;

// ========================================
// Appointment Schemas
// ========================================

export const appointmentSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .max(100, 'Title must be less than 100 characters'),
    type: z.enum(['vet_appointment', 'grooming', 'training', 'medication', 'other'], {
        errorMap: () => ({ message: 'Please select an appointment type' }),
    }),
    date: z.date({
        required_error: 'Date is required',
    }),
    time: z.string()
        .min(1, 'Time is required')
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
    duration: z.number()
        .positive('Duration must be positive')
        .max(480, 'Duration must be less than 8 hours')
        .optional(),
    location: z.string().optional(),
    address: z.string().optional(),
    veterinarian: z.string().optional(),
    notes: z.string().optional(),
    reminderMinutes: z.number()
        .nonnegative('Reminder must be non-negative')
        .optional(),
});

export type Appointment = z.infer<typeof appointmentSchema>;

// ========================================
// Health Record Schemas
// ========================================

export const healthRecordSchema = z.object({
    date: z.date({
        required_error: 'Date is required',
    }),
    weight: z.number().positive('Weight must be positive').optional(),
    temperature: z.number()
        .min(95, 'Temperature too low')
        .max(110, 'Temperature too high')
        .optional(),
    heartRate: z.number()
        .positive('Heart rate must be positive')
        .optional(),
    symptoms: z.string().optional(),
    diagnosis: z.string().optional(),
    treatment: z.string().optional(),
    veterinarian: z.string().optional(),
    notes: z.string().optional(),
});

export type HealthRecord = z.infer<typeof healthRecordSchema>;

// ========================================
// Document Schemas
// ========================================

export const documentSchema = z.object({
    name: z.string()
        .min(1, 'Document name is required')
        .max(100, 'Name must be less than 100 characters'),
    category: z.enum(['medical', 'vaccination', 'insurance', 'adoption', 'other'], {
        errorMap: () => ({ message: 'Please select a category' }),
    }),
    date: z.date().optional(),
    expiryDate: z.date().optional(),
    notes: z.string().optional(),
    fileUrl: z.string().url('Invalid file URL').optional(),
}).refine(data => {
    if (data.expiryDate && data.date) {
        return data.expiryDate >= data.date;
    }
    return true;
}, {
    message: 'Expiry date must be after document date',
    path: ['expiryDate'],
});

export type Document = z.infer<typeof documentSchema>;

// ========================================
// Utility Schemas
// ========================================

export const emailSchema = z.string().email('Invalid email address');
export const phoneSchema = z.string()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number');
export const urlSchema = z.string().url('Invalid URL');
