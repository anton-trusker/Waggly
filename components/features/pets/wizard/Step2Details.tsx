import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform, Modal, FlatList } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import { useBreeds } from '@/hooks/useBreeds';
import { formatAge } from '@/utils/dateUtils';
import EnhancedDatePicker from '@/components/ui/EnhancedDatePicker';
import ModernSelect from '@/components/ui/ModernSelect';
import { useLocale } from '@/hooks/useLocale';

const BLOOD_TYPES = [
    { label: 'DEA 1.1 Positive', value: 'DEA 1.1 Positive' },
    { label: 'DEA 1.1 Negative', value: 'DEA 1.1 Negative' },
    { label: 'Type A', value: 'Type A' },
    { label: 'Type B', value: 'Type B' },
    { label: 'Type AB', value: 'Type AB' },
    { label: 'Unknown', value: 'Unknown' },
];

export interface Step2Data {
    breed: string;
    dateOfBirth?: Date;
    weight: number;
    weightUnit: 'kg' | 'lbs';
    height: number;
    heightUnit: 'cm' | 'in';
    bloodType: string;
}

interface Step2Props {
    initialData: Step2Data;
    species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'reptile' | 'other';
    onNext: (data: Step2Data) => void;
}

export default function Step2Details({ initialData, species, onNext }: Step2Props) {
    const { t, locale } = useLocale();
    const [breed, setBreed] = useState(initialData.breed);
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(initialData.dateOfBirth);
    const [weight, setWeight] = useState(initialData.weight ? initialData.weight.toString() : '');
    const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(initialData.weightUnit || 'kg');
    const [height, setHeight] = useState(initialData.height ? initialData.height.toString() : '');
    const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>(initialData.heightUnit || 'cm');
    const [bloodType, setBloodType] = useState(initialData.bloodType || '');

    // Custom Modal States
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showBreedModal, setShowBreedModal] = useState(false);
    const [breedQuery, setBreedQuery] = useState('');

    // Fetch Breeds
    const { breeds, loading: breedsLoading, loadMore, hasMore } = useBreeds(
        (species === 'dog' || species === 'cat') ? species : 'dog',
        breedQuery
    );

    const handleNext = () => {
        onNext({
            breed,
            dateOfBirth,
            weight: parseFloat(weight) || 0,
            weightUnit,
            height: parseFloat(height) || 0,
            heightUnit,
            bloodType,
        });
    };

    const showBreedSearch = species === 'dog' || species === 'cat';

    const onDateConfirm = (selectedDate: Date) => {
        setDateOfBirth(selectedDate);
        setShowDatePicker(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.headerSection}>
                    <Text style={styles.title}>{t('add_pet.step2.title')}</Text>
                    <Text style={styles.subtitle}>{t('add_pet.step2.subtitle')}</Text>
                </View>

                <View style={styles.formSection}>
                    {/* Breed - Only for dogs and cats */}
                    {showBreedSearch && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('add_pet.step2.breed_label')}</Text>
                            <TouchableOpacity
                                style={styles.dropdownTrigger}
                                onPress={() => setShowBreedModal(true)}
                            >
                                <Text style={breed ? styles.inputText : styles.placeholderText}>
                                    {breed || t('add_pet.step2.breed_placeholder')}
                                </Text>
                                <IconSymbol ios_icon_name="chevron.down" android_material_icon_name="expand-more" size={20} color={designSystem.colors.primary[500]} />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Date of Birth - Using EnhancedDatePicker with calendar */}
                    <EnhancedDatePicker
                        label={t('add_pet.step2.dob_label')}
                        value={dateOfBirth ? `${dateOfBirth.getDate().toString().padStart(2, '0')}-${(dateOfBirth.getMonth() + 1).toString().padStart(2, '0')}-${dateOfBirth.getFullYear()}` : ''}
                        onChange={(dateStr) => {
                            if (!dateStr) {
                                setDateOfBirth(undefined);
                                return;
                            }
                            // EnhancedDatePicker returns DD-MM-YYYY format
                            const [day, month, year] = dateStr.split('-');
                            const parsed = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                            if (!isNaN(parsed.getTime())) {
                                setDateOfBirth(parsed);
                            }
                        }}
                        placeholder="Select date of birth"
                    />

                    {/* Weight and Height on one row */}
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>{t('add_pet.step2.weight_label')}</Text>
                            <View style={styles.inputWithUnit}>
                                <TextInput
                                    style={[styles.input, styles.compactInput]}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={weight}
                                    onChangeText={setWeight}
                                    placeholderTextColor={designSystem.colors.text.tertiary}
                                    maxLength={3}
                                />
                                <View style={styles.toggle}>
                                    <TouchableOpacity
                                        style={[styles.toggleOption, weightUnit === 'kg' && styles.toggleSelected]}
                                        onPress={() => setWeightUnit('kg')}
                                    >
                                        <Text style={[styles.toggleText, weightUnit === 'kg' && styles.toggleTextSelected]}>KG</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.toggleOption, weightUnit === 'lbs' && styles.toggleSelected]}
                                        onPress={() => setWeightUnit('lbs')}
                                    >
                                        <Text style={[styles.toggleText, weightUnit === 'lbs' && styles.toggleTextSelected]}>LBS</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={styles.col}>
                            <Text style={styles.label}>{t('add_pet.step2.height_label')}</Text>
                            <View style={styles.inputWithUnit}>
                                <TextInput
                                    style={[styles.input, styles.compactInput]}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={height}
                                    onChangeText={setHeight}
                                    placeholderTextColor={designSystem.colors.text.tertiary}
                                    maxLength={3}
                                />
                                <View style={styles.toggle}>
                                    <TouchableOpacity
                                        style={[styles.toggleOption, heightUnit === 'cm' && styles.toggleSelected]}
                                        onPress={() => setHeightUnit('cm')}
                                    >
                                        <Text style={[styles.toggleText, heightUnit === 'cm' && styles.toggleTextSelected]}>CM</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.toggleOption, heightUnit === 'in' && styles.toggleSelected]}
                                        onPress={() => setHeightUnit('in')}
                                    >
                                        <Text style={[styles.toggleText, heightUnit === 'in' && styles.toggleTextSelected]}>IN</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Blood Type */}
                    <ModernSelect
                        label={t('add_pet.step2.blood_type_label')}
                        placeholder={t('add_pet.step2.blood_type_placeholder')}
                        value={bloodType}
                        options={BLOOD_TYPES}
                        onChange={setBloodType}
                        searchable
                    />
                </View>
                <View style={{ height: Platform.OS === 'web' ? 100 : 160 }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleNext}
                >
                    <Text style={styles.continueButtonText}>{t('add_pet.step1.continue')}</Text>
                    <IconSymbol
                        ios_icon_name="arrow.right"
                        android_material_icon_name="arrow-forward"
                        size={20}
                        color={designSystem.colors.neutral[0]}
                    />
                </TouchableOpacity>
            </View>

            {/* Breed Selector Modal */}
            <Modal
                visible={showBreedModal}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <View style={styles.searchContainer}>
                            <IconSymbol ios_icon_name="magnifyingglass" android_material_icon_name="search" size={20} color={designSystem.colors.text.tertiary} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder={t('add_pet.step2.search_breed')}
                                value={breedQuery}
                                onChangeText={setBreedQuery}
                                autoFocus
                            />
                        </View>
                        <TouchableOpacity onPress={() => setShowBreedModal(false)} style={styles.closeButton}>
                            <Text style={styles.closeText}>{t('add_pet.step2.close')}</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={breeds}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.breedItem}
                                onPress={() => {
                                    setBreed(item.name);
                                    setShowBreedModal(false);
                                }}
                            >
                                <Text style={styles.breedText}>{item.name}</Text>
                                {item.name === breed && (
                                    <IconSymbol ios_icon_name="checkmark" android_material_icon_name="check" size={20} color={designSystem.colors.primary[500]} />
                                )}
                            </TouchableOpacity>
                        )}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingHorizontal: 24, paddingTop: 16 },
    headerSection: { marginBottom: 24 },
    iconContainer: {
        width: 56, height: 56, borderRadius: 14,
        backgroundColor: designSystem.colors.primary[50],
        justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    },
    title: { ...(designSystem.typography.title.large as any), color: designSystem.colors.text.primary, marginBottom: 6 },
    subtitle: { ...(designSystem.typography.body.medium as any), color: designSystem.colors.text.secondary },
    formSection: { gap: 20 },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    col: { flex: 1, gap: 8 },
    inputWithUnit: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },
    toggle: {
        flexDirection: 'row',
        backgroundColor: designSystem.colors.neutral[100],
        borderRadius: 12,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        padding: 4,
        gap: 4,
    },
    toggleOption: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        minWidth: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    toggleSelected: {
        backgroundColor: designSystem.colors.primary[500],
        borderColor: designSystem.colors.primary[600],
        ...designSystem.shadows.sm,
    },
    toggleText: {
        fontSize: 12,
        fontWeight: '700',
        color: designSystem.colors.text.secondary,
    },
    toggleTextSelected: {
        color: designSystem.colors.neutral[0],
    },
    inputGroup: { gap: 8 },
    label: { ...(designSystem.typography.label.small as any), color: designSystem.colors.text.secondary, letterSpacing: 1, fontWeight: '700' },
    input: {
        backgroundColor: designSystem.colors.neutral[0], borderWidth: 1, borderColor: designSystem.colors.neutral[200],
        borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16, fontSize: 16, color: designSystem.colors.text.primary,
        ...designSystem.shadows.sm,
    },
    compactInput: {
        flex: 1,
        maxWidth: 100,
        textAlign: 'center',
    },
    dropdownTrigger: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: designSystem.colors.neutral[0], borderWidth: 1, borderColor: designSystem.colors.neutral[200],
        borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16, ...designSystem.shadows.sm,
    },
    dateTrigger: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: designSystem.colors.neutral[0], borderWidth: 1, borderColor: designSystem.colors.neutral[200],
        borderRadius: 12, paddingHorizontal: 16, paddingLeft: 48, paddingVertical: 16, ...designSystem.shadows.sm,
        position: 'relative',
    },
    dateInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: designSystem.colors.neutral[0],
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 12,
        ...designSystem.shadows.sm,
    },
    dateInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        color: designSystem.colors.text.primary,
    },
    dateDisplayButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: designSystem.colors.neutral[0],
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        ...designSystem.shadows.sm,
    },
    dateText: {
        fontSize: 16,
        color: designSystem.colors.text.primary,
    },
    datePlaceholder: {
        fontSize: 16,
        color: designSystem.colors.text.tertiary,
    },
    calendarButton: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    inputText: { fontSize: 16, color: designSystem.colors.text.primary },
    placeholderText: { fontSize: 16, color: designSystem.colors.text.tertiary },
    genderRow: { flexDirection: 'row', gap: 16 },
    genderCard: {
        flex: 1, height: 80, backgroundColor: designSystem.colors.neutral[0], borderWidth: 2, borderColor: designSystem.colors.neutral[100],
        borderRadius: 16, justifyContent: 'center', alignItems: 'center', position: 'relative',
    },
    genderCardSelected: { borderColor: designSystem.colors.primary[500], backgroundColor: designSystem.colors.primary[50] },
    genderLabel: { ...(designSystem.typography.label.medium as any), marginTop: 4, color: designSystem.colors.text.secondary, fontWeight: '700' },
    genderLabelSelected: { color: designSystem.colors.primary[700] },
    checkIcon: { position: 'absolute', top: 8, right: 8 },
    weightRow: { flexDirection: 'row', gap: 12 },
    weightInputContainer: { flex: 2, position: 'relative' },
    weightInput: {
        backgroundColor: designSystem.colors.neutral[0], borderWidth: 1, borderColor: designSystem.colors.neutral[200],
        borderRadius: 12, paddingHorizontal: 16, paddingLeft: 48, paddingVertical: 16, fontSize: 16, color: designSystem.colors.text.primary,
        ...designSystem.shadows.sm,
    },
    weightIcon: { position: 'absolute', left: 16, top: 18 },
    inputIcon: { position: 'absolute', left: 16, top: 18 },
    unitToggle: { flex: 1, flexDirection: 'row', backgroundColor: designSystem.colors.neutral[100], borderRadius: 12, padding: 4 },
    unitOption: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
    unitOptionSelected: { backgroundColor: designSystem.colors.neutral[0], ...designSystem.shadows.sm },
    unitText: { ...(designSystem.typography.label.small as any), color: designSystem.colors.text.tertiary, fontWeight: '700' },
    unitTextSelected: { color: designSystem.colors.primary[500] },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
    hint: { ...(designSystem.typography.label.small as any), color: designSystem.colors.text.tertiary },
    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16,
        backgroundColor: designSystem.colors.background.primary, borderTopWidth: 1, borderTopColor: designSystem.colors.neutral[100],
        paddingBottom: 16,
    },
    continueButton: {
        backgroundColor: designSystem.colors.primary[500], flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 16, borderRadius: 12, gap: 8, ...designSystem.shadows.md,
    },
    continueButtonText: { ...(designSystem.typography.title.medium as any), color: designSystem.colors.neutral[0], fontWeight: '800' },
    modalContainer: { flex: 1, backgroundColor: designSystem.colors.background.primary },
    modalHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: designSystem.colors.neutral[100] },
    searchContainer: {
        flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: designSystem.colors.neutral[100],
        borderRadius: 12, paddingHorizontal: 12, height: 44, gap: 8
    },
    searchInput: { flex: 1, fontSize: 16, color: designSystem.colors.text.primary, height: '100%' },
    closeButton: { paddingHorizontal: 8, paddingVertical: 4, marginLeft: 4 }, // Added margin to prevent edge placement
    closeText: { ...(designSystem.typography.body.medium as any), color: designSystem.colors.primary[500], fontWeight: '600' },
    breedItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: designSystem.colors.neutral[100] },
    breedText: { ...(designSystem.typography.body.large as any), color: designSystem.colors.text.primary }
});
