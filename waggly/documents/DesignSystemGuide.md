# Waggly Design System Guide

This guide documents the reusable components and design patterns for the Waggly application.

## 1. Core Primitives
Located in `components/design-system/primitives/`

These are stateless UI components that form the building blocks of the UI.

### Button
Standard button component supporting various variants and states.

```tsx
import { Button } from '@/components/design-system/primitives/Button';

// Usages
<Button title="Primary Action" onPress={handlePress} />
<Button title="Secondary" variant="secondary" />
<Button title="Outline" variant="outline" />
<Button title="Destructive" variant="ghost" icon="trash" />
<Button title="Loading..." loading />
```

### Input
Standard text input with label and error support.

```tsx
import { Input } from '@/components/design-system/primitives/Input';

<Input 
  label="Email" 
  placeholder="user@example.com" 
  error={errorMessage} 
/>
```

### Select
Dropdown selection component.

```tsx
import { Select } from '@/components/design-system/primitives/Select';

<Select
  label="Gender"
  options={[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }]}
  value={selectedGender}
  onSelect={handleSelect}
/>
```

### DatePicker
Native-backed date picker with unified styling.

```tsx
import { DatePicker } from '@/components/design-system/primitives/DatePicker';

<DatePicker
  label="Birth Date"
  value={dateObject}
  onChange={setDate}
/>
```

## 2. Form Fields (React Hook Form)
Located in `components/design-system/forms/`

Wrappers around primitives that integrate directly with `react-hook-form`.

### TextField
```tsx
import { TextField } from '@/components/design-system/forms/TextField';

<TextField
  control={control}
  name="email"
  label="Email Address"
  rules={{ required: true }}
/>
```

### SelectField
```tsx
import { SelectField } from '@/components/design-system/forms/SelectField';

<SelectField
  control={control}
  name="type"
  label="Type"
  options={TYPE_OPTIONS}
/>
```

### DateField
```tsx
import { DateField } from '@/components/design-system/forms/DateField';

<DateField
  control={control}
  name="dateOfBirth"
  label="Date of Birth"
/>
```

## 3. Smart Widgets
Located in `components/design-system/widgets/`

Complex components that handle specific domain logic or complex interactions.

### AddressWidget
Handles Google Places Autocomplete interactions.

```tsx
import { AddressWidget } from '@/components/design-system/widgets/AddressWidget';

<AddressWidget
  label="Home Address"
  initialValue={addressString}
  onChange={(details) => setAddress(details)}
/>
```

### MeasurementWidget
Handles unit conversion (metric/imperial) for weight and height.

```tsx
import { MeasurementWidget } from '@/components/design-system/widgets/MeasurementWidget';

<MeasurementWidget
  type="weight"
  label="Current Weight"
  value={{ value: 10, unit: 'kg' }}
  onChange={handleWeightChange}
/>
```

### MoneyWidget
Handles currency selection and amount input.

```tsx
import { MoneyWidget } from '@/components/design-system/widgets/MoneyWidget';

<MoneyWidget
  label="Cost"
  value={{ amount: 50, currency: 'USD' }}
  onChange={handleCostChange}
/>
```

## 4. Theming
The design system constants are available in `@/constants/designSystem`.

```tsx
import { designSystem } from '@/constants/designSystem';

const styles = StyleSheet.create({
  container: {
    backgroundColor: designSystem.colors.background.primary,
    padding: designSystem.spacing.md,
  }
});
```
