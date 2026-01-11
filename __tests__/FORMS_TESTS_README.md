# Forms System Unit Tests

## Overview
Comprehensive unit tests for all enhanced form modals in the Waggli Forms System.

## Test Coverage

### Form Components
1. **VisitFormModal.test.tsx** - 50+ test cases
   - Rendering and visibility
   - Provider type selection (9 types)
   - Conditional medical fields
   - Business information capture
   - Cost tracking
   - Form validation

2. **MedicationFormModal.test.tsx** - 60+ test cases
   - Medication interaction warnings
   - Allergy detection
   - Refill management
   - Side effects tracking
   - Dosage configuration
   - Duration management

3. **HealthMetricsModal.test.tsx** - 50+ test cases
   - Weight trend analysis
   - Weight gain/loss calculation
   - Unit conversions
   - Vital signs input
   - Body condition scoring
   - Lab results section

### Utility Functions
1. **formUtils.test.ts** - 20+ test cases
   - `calculateWeightTrend()` - Weight change percentage
   - `checkMedicationInteraction()` - Drug interaction detection
   - `checkAllergyMatch()` - Allergy cross-checking
   - `calculateNextRefillDate()` - Refill schedule calculation
   - `validateDosage()` - Dosage validation
   - `getBodyConditionDescription()` - BCS labeling

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test VisitFormModal
npm test MedicationFormModal
npm test HealthMetricsModal
npm test formUtils
```

### Run with Coverage
```bash
npm test -- --coverage
```

### Watch Mode
```bash
npm test -- --watch
```

## Test Structure

Each test file follows this structure:
```typescript
describe('ComponentName', () => {
  describe('Feature Category', () => {
    it('should do specific thing', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Mocking

### Supabase
All tests mock Supabase operations:
```typescript
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => Promise.resolve({ error: null })),
      select: jest.fn(() => ({ ... }))
    }))
  }
}));
```

### usePets Hook
```typescript
jest.mock('@/hooks/usePets', () => ({
  usePets: () => ({
    pets: [{ id: 'pet1', name: 'Max' }],
    loading: false
  })
}));
```

## Test Categories

### Unit Tests
- Pure function logic
- Calculation accuracy
- Input validation
- Data transformation

### Component Tests
- Rendering behavior
- User interactions
- State changes
- Conditional display

### Integration Tests (Future)
- Database operations
- API calls
- Multi-component workflows

## Coverage Goals

| Component | Target Coverage |
|-----------|----------------|
| VisitFormModal | >80% |
| MedicationFormModal | >80% |
| HealthMetricsModal | >80% |
| Form Utilities | >90% |

## Known Issues

### React Native Warnings
Some warnings about `className` props are expected due to `cssInterop` configuration. These don't affect test results.

### Async Operations
Tests with `waitFor` may timeout if mock data isn't configured correctly. Increase timeout if needed:
```typescript
await waitFor(() => {
  expect(something).toBeTruthy();
}, { timeout: 3000 });
```

## Adding New Tests

When adding new features, follow these guidelines:

1. **Create test file** in `__tests__/components/` or `__tests__/utils/`
2. **Mock dependencies** (Supabase, hooks, etc.)
3. **Group by feature** using `describe` blocks
4. **Test happy paths** and error cases
5. **Test edge cases** (empty inputs, extreme values)
6. **Document complex tests** with comments

## Example Test

```typescript
describe('MedicationFormModal', () => {
  describe('Interaction Warnings', () => {
    it('should detect NSAID + Steroid interaction', async () => {
      // Arrange
      const { getByPlaceholderText } = render(
        <MedicationFormModal visible={true} onClose={jest.fn()} petId="pet1" />
      );

      // Act
      const input = getByPlaceholderText('medication name');
      fireEvent.changeText(input, 'Carprofen');

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/interaction/i)).toBeTruthy();
      });
    });
  });
});
```

## Debugging Tests

### View Test Output
```bash
npm test -- --verbose
```

### Debug Single Test
```bash
npm test -- --testNamePattern="should detect interaction"
```

### Console Logging
Use `console.log` in tests for debugging (remove before commit):
```typescript
it('should do something', () => {
  const result = calculateWeightTrend(27, 25, 'kg', 'kg');
  console.log('Trend result:', result); // Debug
  expect(result.direction).toBe('up');
});
```

## Continuous Integration

Tests should be run in CI/CD pipeline:
```yaml
# .github/workflows/test.yml
- name: Run Tests
  run: npm test -- --ci --coverage
```

## Future Enhancements

- [ ] E2E tests with Detox
- [ ] Visual regression tests
- [ ] Performance benchmarks
- [ ] Accessibility tests
- [ ] Database integration tests

## Resources

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)

---

**Total Tests**: 180+  
**Target Coverage**: >80%  
**Test Runner**: Jest  
**Testing Library**: React Testing Library
