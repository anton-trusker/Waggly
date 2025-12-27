import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform, Modal, FlatList } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import { useBreeds } from '@/hooks/useBreeds';
import { formatAge } from '@/utils/dateUtils';
import CustomDatePicker from '@/components/ui/CustomDatePicker';

export interface Step2Data {
    breed: string;
    gender: 'male' | 'female';
    dateOfBirth?: Date;
}

interface Step2Props {
    initialData: Step2Data;
    species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'reptile' | 'other';
    onNext: (data: Step2Data) => void;
}

export default function Step2Details({ initialData, species, onNext }: Step2Props) {
    const [breed, setBreed] = useState(initialData.breed);
    const [gender, setGender] = useState<'male' | 'female'>(initialData.gender);
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(initialData.dateOfBirth);

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
            gender,
            dateOfBirth,
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
                    <View style={styles.iconContainer}>
                        <IconSymbol
                            ios_icon_name="pawprint.fill"
                            android_material_icon_name="pets"
                            size={28}
                            color={designSystem.colors.primary[500]}
                        />
                    </View>
                    <Text style={styles.title}>Details needed</Text>
                    <Text style={styles.subtitle}>Help us tailor the experience.</Text>
                </View>

                <View style={styles.formSection}>
                    {/* Breed Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>BREED</Text>
                        {showBreedSearch ? (
                            <TouchableOpacity
                                style={styles.dropdownTrigger}
                                onPress={() => setShowBreedModal(true)}
                            >
                                <Text style={breed ? styles.inputText : styles.placeholderText}>
                                    {breed || "Select breed type"}
                                </Text>
                                <IconSymbol ios_icon_name="chevron.down" android_material_icon_name="expand-more" size={20} color={designSystem.colors.primary[500]} />
                            </TouchableOpacity>
                        ) : (
                            <TextInput
                                style={styles.input}
                                placeholder="Enter breed or type"
                                placeholderTextColor={designSystem.colors.text.tertiary}
                                value={breed}
                                onChangeText={setBreed}
                            />
                        )}
                    </View>

                    {/* Gender Selection */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>GENDER</Text>
                        <View style={styles.genderRow}>
                            <TouchableOpacity
                                style={[styles.genderCard, gender === 'male' && styles.genderCardSelected]}
                                onPress={() => setGender('male')}
                            >
                                <IconSymbol
                                    ios_icon_name="circle" // SFSymbol fallback
                                    android_material_icon_name="male"
                                    size={28}
                                    color={gender === 'male' ? designSystem.colors.primary[500] : designSystem.colors.text.tertiary}
                                />
                                <Text style={[styles.genderLabel, gender === 'male' && styles.genderLabelSelected]}>Male</Text>
                                {gender === 'male' && (
                                    <View style={styles.checkIcon}>
                                        <IconSymbol ios_icon_name="checkmark.circle.fill" android_material_icon_name="check-circle" size={18} color={designSystem.colors.primary[500]} />
                                    </View>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.genderCard, gender === 'female' && styles.genderCardSelected]}
                                onPress={() => setGender('female')}
                            >
                                <IconSymbol
                                    ios_icon_name="circle" // SFSymbol fallback
                                    android_material_icon_name="female"
                                    size={28}
                                    color={gender === 'female' ? designSystem.colors.primary[500] : designSystem.colors.text.tertiary}
                                />
                                <Text style={[styles.genderLabel, gender === 'female' && styles.genderLabelSelected]}>Female</Text>
                                {gender === 'female' && (
                                    <View style={styles.checkIcon}>
                                        <IconSymbol ios_icon_name="checkmark.circle.fill" android_material_icon_name="check-circle" size={18} color={designSystem.colors.primary[500]} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Date of Birth Custom Picker */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>DATE OF BIRTH</Text>
                        <TouchableOpacity
                            style={styles.dateTrigger}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <IconSymbol ios_icon_name="calendar" android_material_icon_name="event" size={20} color={designSystem.colors.primary[500]} style={styles.inputIcon} />
                            <Text style={dateOfBirth ? styles.inputText : styles.placeholderText}>
                                {dateOfBirth ? dateOfBirth.toLocaleDateString() : 'MM/DD/YYYY'}
                            </Text>
                        </TouchableOpacity>
                        {dateOfBirth && (
                            <Text style={styles.hint}>Age: {formatAge(dateOfBirth)}</Text>
                        )}
                    </View>
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleNext}
                >
                    <Text style={styles.continueButtonText}>Continue</Text>
                    <IconSymbol
                        ios_icon_name="arrow.right"
                        android_material_icon_name="arrow-forward"
                        size={20}
                        color={designSystem.colors.neutral[0]}
                    />
                </TouchableOpacity>
            </View>

            {/* Date Picker Modal */}
            <CustomDatePicker
                visible={showDatePicker}
                date={dateOfBirth || new Date()}
                onClose={() => setShowDatePicker(false)}
                onConfirm={onDateConfirm}
            />

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
                                placeholder="Search breed..."
                                value={breedQuery}
                                onChangeText={setBreedQuery}
                                autoFocus
                            />
                        </View>
                        <TouchableOpacity onPress={() => setShowBreedModal(false)} style={styles.closeButton}>
                            <Text style={styles.closeText}>Close</Text>
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
    title: { ...designSystem.typography.title.large, color: designSystem.colors.text.primary, marginBottom: 6 },
    subtitle: { ...designSystem.typography.body.medium, color: designSystem.colors.text.secondary },
    formSection: { gap: 20 },
    inputGroup: { gap: 8 },
    label: { ...designSystem.typography.label.small, color: designSystem.colors.text.secondary, letterSpacing: 1, fontWeight: '700' },
    input: {
        backgroundColor: designSystem.colors.neutral[0], borderWidth: 1, borderColor: designSystem.colors.neutral[200],
        borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16, fontSize: 16, color: designSystem.colors.text.primary,
        ...designSystem.shadows.sm,
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
    inputText: { fontSize: 16, color: designSystem.colors.text.primary },
    placeholderText: { fontSize: 16, color: designSystem.colors.text.tertiary },
    genderRow: { flexDirection: 'row', gap: 16 },
    genderCard: {
        flex: 1, height: 80, backgroundColor: designSystem.colors.neutral[0], borderWidth: 2, borderColor: designSystem.colors.neutral[100],
        borderRadius: 16, justifyContent: 'center', alignItems: 'center', position: 'relative',
    },
    genderCardSelected: { borderColor: designSystem.colors.primary[500], backgroundColor: designSystem.colors.primary[50] },
    genderLabel: { ...designSystem.typography.label.medium, marginTop: 4, color: designSystem.colors.text.secondary, fontWeight: '700' },
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
    unitText: { ...designSystem.typography.label.small, color: designSystem.colors.text.tertiary, fontWeight: '700' },
    unitTextSelected: { color: designSystem.colors.primary[500] },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
    hint: { ...designSystem.typography.label.small, color: designSystem.colors.text.tertiary },
    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16,
        backgroundColor: designSystem.colors.background.primary, borderTopWidth: 1, borderTopColor: designSystem.colors.neutral[100],
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    },
    continueButton: {
        backgroundColor: designSystem.colors.primary[500], flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 16, borderRadius: 12, gap: 8, ...designSystem.shadows.md,
    },
    continueButtonText: { ...designSystem.typography.title.medium, color: designSystem.colors.neutral[0], fontWeight: '800' },
    modalContainer: { flex: 1, backgroundColor: designSystem.colors.background.primary },
    modalHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: designSystem.colors.neutral[100] },
    searchContainer: {
        flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: designSystem.colors.neutral[100],
        borderRadius: 12, paddingHorizontal: 12, height: 44, gap: 8
    },
    searchInput: { flex: 1, fontSize: 16, color: designSystem.colors.text.primary, height: '100%' },
    closeButton: { padding: 4 },
    closeText: { ...designSystem.typography.body.medium, color: designSystem.colors.primary[500] },
    breedItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: designSystem.colors.neutral[100] },
    breedText: { ...designSystem.typography.body.large, color: designSystem.colors.text.primary }
});
