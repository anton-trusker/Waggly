import { describe, it, expect } from '@jest/globals';

/**
 * Utility functions for form calculations and validations
 */

/**
 * Calculate weight trend percentage
 */
export function calculateWeightTrend(
    currentWeight: number,
    previousWeight: number,
    currentUnit: 'kg' | 'lbs',
    previousUnit: 'kg' | 'lbs'
): { change: number; direction: 'up' | 'down' | 'stable' } {
    // Convert to same unit (kg) for comparison
    const currentInKg = currentUnit === 'lbs' ? currentWeight / 2.20462 : currentWeight;
    const previousInKg = previousUnit === 'lbs' ? previousWeight / 2.20462 : previousWeight;

    const changePercent = ((currentInKg - previousInKg) / previousInKg) * 100;

    const direction = Math.abs(changePercent) < 2
        ? 'stable'
        : changePercent > 0
            ? 'up'
            : 'down';

    return {
        change: Math.abs(changePercent),
        direction
    };
}

/**
 * Check for medication interactions
 */
export function checkMedicationInteraction(
    medicationName: string,
    activeMedications: string[]
): string[] {
    const warnings: string[] = [];
    const medLower = medicationName.toLowerCase();

    // Known drug interaction database (simplified)
    const interactions: Record<string, string[]> = {
        'nsaid': ['steroid', 'prednisone', 'dexamethasone'],
        'steroid': ['nsaid', 'carprofen', 'meloxicam', 'aspirin'],
        'antibiotic': ['antacid'],
        'prednisone': ['nsaid', 'carprofen'],
        'carprofen': ['steroid', 'prednisone'],
    };

    activeMedications.forEach(activeMed => {
        const activeLower = activeMed.toLowerCase();

        Object.entries(interactions).forEach(([drug, interactsWith]) => {
            if (medLower.includes(drug)) {
                interactsWith.forEach(interacting => {
                    if (activeLower.includes(interacting)) {
                        warnings.push(
                            `Possible interaction between ${medicationName} and ${activeMed}`
                        );
                    }
                });
            }
        });
    });

    return warnings;
}

/**
 * Check if medication name matches allergy
 */
export function checkAllergyMatch(
    medicationName: string,
    allergenName: string
): boolean {
    const medLower = medicationName.toLowerCase();
    const allergenLower = allergenName.toLowerCase();

    // Check for exact match or substring match
    if (medLower.includes(allergenLower) || allergenLower.includes(medLower)) {
        return true;
    }

    // Check for known drug family matches
    const drugFamilies: Record<string, string[]> = {
        'penicillin': ['amoxicillin', 'ampicillin', 'penicillin'],
        'cephalosporin': ['cephalexin', 'cefpodoxime'],
    };

    for (const [family, drugs] of Object.entries(drugFamilies)) {
        if (allergenLower.includes(family)) {
            if (drugs.some(drug => medLower.includes(drug))) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Calculate next refill date
 */
export function calculateNextRefillDate(
    startDate: string,
    refillEveryDays: number
): string {
    const start = new Date(startDate);
    start.setDate(start.getDate() + refillEveryDays);
    return start.toISOString().split('T')[0];
}

/**
 * Validate dosage value
 */
export function validateDosage(
    value: string
): { valid: boolean; error?: string } {
    const num = parseFloat(value);

    if (isNaN(num)) {
        return { valid: false, error: 'Dosage must be a number' };
    }

    if (num <= 0) {
        return { valid: false, error: 'Dosage must be greater than 0' };
    }

    if (num > 10000) {
        return { valid: false, error: 'Dosage seems unusually high' };
    }

    return { valid: true };
}

/**
 * Format body condition description
 */
export function getBodyConditionDescription(
    score: number
): { label: string; color: string } {
    const descriptions: Record<number, { label: string; color: string }> = {
        1: { label: 'Emaciated', color: '#EF4444' },
        2: { label: 'Very Thin', color: '#F59E0B' },
        3: { label: 'Thin', color: '#F59E0B' },
        4: { label: 'Underweight', color: '#FBBF24' },
        5: { label: 'Ideal', color: '#10B981' },
        6: { label: 'Overweight', color: '#FBBF24' },
        7: { label: 'Heavy', color: '#F59E0B' },
        8: { label: 'Obese', color: '#EF4444' },
        9: { label: 'Severely Obese', color: '#EF4444' },
    };

    return descriptions[score] || { label: 'Unknown', color: '#6B7280' };
}

// ============================================
// TESTS
// ============================================

describe('Form Utilities', () => {
    describe('calculateWeightTrend', () => {
        it('should calculate weight gain percentage', () => {
            const result = calculateWeightTrend(27, 25, 'kg', 'kg');

            expect(result.change).toBeCloseTo(8, 1);
            expect(result.direction).toBe('up');
        });

        it('should calculate weight loss percentage', () => {
            const result = calculateWeightTrend(23, 25, 'kg', 'kg');

            expect(result.change).toBeCloseTo(8, 1);
            expect(result.direction).toBe('down');
        });

        it('should identify stable weight (< 2% change)', () => {
            const result = calculateWeightTrend(25.4, 25, 'kg', 'kg');

            expect(result.change).toBeLessThan(2);
            expect(result.direction).toBe('stable');
        });

        it('should convert units for comparison', () => {
            // 25 kg = 55.115 lbs
            // 60 lbs = ~27.2 kg (8.8% increase)
            const result = calculateWeightTrend(60, 25, 'lbs', 'kg');

            expect(result.change).toBeGreaterThan(7);
            expect(result.direction).toBe('up');
        });

        it('should handle lbs to lbs comparison', () => {
            const result = calculateWeightTrend(60, 55, 'lbs', 'lbs');

            expect(result.change).toBeCloseTo(9.09, 1);
            expect(result.direction).toBe('up');
        });
    });

    describe('checkMedicationInteraction', () => {
        it('should detect NSAID + Steroid interaction', () => {
            const warnings = checkMedicationInteraction('Carprofen', ['Prednisone']);

            expect(warnings.length).toBeGreaterThan(0);
            expect(warnings[0]).toContain('interaction');
        });

        it('should detect Steroid + NSAID interaction', () => {
            const warnings = checkMedicationInteraction('Prednisone', ['Carprofen']);

            expect(warnings.length).toBeGreaterThan(0);
        });

        it('should return empty array for non-interacting medications', () => {
            const warnings = checkMedicationInteraction('Apoquel', ['Cephalexin']);

            expect(warnings.length).toBe(0);
        });

        it('should detect multiple interactions', () => {
            const warnings = checkMedicationInteraction('NSAID Med', ['Prednisone', 'Dexamethasone']);

            expect(warnings.length).toBeGreaterThan(0);
        });
    });

    describe('checkAllergyMatch', () => {
        it('should match exact medication names', () => {
            const result = checkAllergyMatch('Penicillin', 'Penicillin');
            expect(result).toBe(true);
        });

        it('should match substring in medication name', () => {
            const result = checkAllergyMatch('Amoxicillin', 'Penicillin');
            expect(result).toBe(true);
        });

        it('should detect drug family matches', () => {
            const result = checkAllergyMatch('Amoxicillin', 'Penicillin');
            expect(result).toBe(true);
        });

        it('should return false for non-matching medications', () => {
            const result = checkAllergyMatch('Apoquel', 'Penicillin');
            expect(result).toBe(false);
        });

        it('should be case-insensitive', () => {
            const result = checkAllergyMatch('AMOXICILLIN', 'penicillin');
            expect(result).toBe(true);
        });
    });

    describe('calculateNextRefillDate', () => {
        it('should calculate date 30 days in future', () => {
            const result = calculateNextRefillDate('2025-01-01', 30);
            expect(result).toBe('2025-01-31');
        });

        it('should calculate date 7 days in future', () => {
            const result = calculateNextRefillDate('2025-01-01', 7);
            expect(result).toBe('2025-01-08');
        });

        it('should handle month transitions', () => {
            const result = calculateNextRefillDate('2025-01-25', 10);
            expect(result).toBe('2025-02-04');
        });

        it('should handle year transitions', () => {
            const result = calculateNextRefillDate('2025-12-25', 10);
            expect(result).toBe('2026-01-04');
        });
    });

    describe('validateDosage', () => {
        it('should accept valid positive numbers', () => {
            const result = validateDosage('16');
            expect(result.valid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('should accept decimal values', () => {
            const result = validateDosage('2.5');
            expect(result.valid).toBe(true);
        });

        it('should reject zero', () => {
            const result = validateDosage('0');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('greater than 0');
        });

        it('should reject negative numbers', () => {
            const result = validateDosage('-5');
            expect(result.valid).toBe(false);
        });

        it('should reject non-numeric values', () => {
            const result = validateDosage('abc');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('number');
        });

        it('should warn about unusually high dosages', () => {
            const result = validateDosage('15000');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('unusually high');
        });
    });

    describe('getBodyConditionDescription', () => {
        it('should return correct label for score 1', () => {
            const result = getBodyConditionDescription(1);
            expect(result.label).toBe('Emaciated');
            expect(result.color).toBe('#EF4444');
        });

        it('should return correct label for score 5 (ideal)', () => {
            const result = getBodyConditionDescription(5);
            expect(result.label).toBe('Ideal');
            expect(result.color).toBe('#10B981');
        });

        it('should return correct label for score 8 (obese)', () => {
            const result = getBodyConditionDescription(8);
            expect(result.label).toBe('Obese');
            expect(result.color).toBe('#EF4444');
        });

        it('should return correct label for score 9', () => {
            const result = getBodyConditionDescription(9);
            expect(result.label).toBe('Severely Obese');
        });

        it('should return Unknown for invalid scores', () => {
            const result = getBodyConditionDescription(10);
            expect(result.label).toBe('Unknown');
        });
    });
});
