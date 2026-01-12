# Migration Guide: Legacy to Design System

This guide outlines how to replace legacy Waggly components with the new Design System components.

## 1. Replacing BottomCTA

**Legacy:** `components/ui/BottomCTA.tsx`
**New:** `components/design-system/primitives/Button.tsx`

**Migration Steps:**
1.  Remove `BottomCTA` import.
2.  Import `Button` from `@/components/design-system/primitives/Button`.
3.  Replace the footer logic.

**Example:**

```tsx
// Before
<BottomCTA
    onPrimary={handleSubmit}
    primaryLabel="Save"
    disabled={submitting}
/>

// After
<View style={{ padding: 20 }}>
    <Button
        title="Save"
        onPress={handleSubmit}
        loading={submitting} // Handles loading state internally
        fullWidth
    />
</View>
```

## 2. Replacing EnhancedDatePicker

**Legacy:** `components/ui/EnhancedDatePicker.tsx`
**New:** `components/design-system/primitives/DatePicker.tsx` OR `components/design-system/forms/DateField.tsx` (if using React Hook Form)

**Migration Steps:**
1.  If using `react-hook-form`, switch to `DateField`.
2.  If standalone, use `DatePicker`.
3.  Note: `DatePicker` handles `Date` objects directly, whereas `EnhancedDatePicker` used string formatting often.

**Example (RHF):**

```tsx
// Before
<EnhancedDatePicker
    label="Date"
    value={dateString}
    onChange={stringChangeHandler}
/>

// After
<DateField
    control={control}
    name="date"
    label="Date"
/>
```

## 3. Replacing WeightSlider

**Legacy:** `components/ui/WeightSlider.tsx`
**New:** `components/design-system/widgets/MeasurementWidget.tsx`

**Migration Steps:**
1.  Use `MeasurementWidget` with `type="weight"`.
2.  It handles unit switching (kg/lbs) automatically.

**Example:**

```tsx
<MeasurementWidget
    type="weight"
    label="Weight"
    value={{ value: weight, unit: unit }}
    onChange={({ value, unit }) => updateWeight(value, unit)}
/>
```

## 4. Replacing ModernSelect / EnhancedSelection

**Legacy:** `components/ui/ModernSelect.tsx`, `EnhancedSelection.tsx`
**New:** `components/design-system/primitives/Select.tsx` OR `components/design-system/forms/SelectField.tsx`

**Example:**

```tsx
<SelectField
    control={control}
    name="gender"
    label="Gender"
    options={[
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
    ]}
/>
```

## 5. Removing LoadingOverlay

**Legacy:** `components/ui/LoadingOverlay.tsx`
**New:** The `Button` component has a `loading` prop that disables interaction and shows a spinner.

**Migration:**
Simply pass `loading={isLoading}` to the submit `Button`. If a full-screen block is absolutely necessary, `LoadingOverlay` can be used, but generally, local loading states on buttons are preferred for a better UX.
