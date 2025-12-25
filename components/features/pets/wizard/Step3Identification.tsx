import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import { Picker } from '@react-native-picker/picker'; // You might need to install this if not available, or use a custom select

export interface Step3Data {
    microchipNumber: string;
    registryProvider: string;
    tagId: string;
}

interface Step3Props {
    initialData: Step3Data;
    onNext: (data: Step3Data) => void;
}

const REGISTRY_PROVIDERS = [
    { label: 'Select provider', value: '' },
    { label: 'HomeAgain', value: 'homeagain' },
    { label: 'Avid', value: 'avid' },
    { label: 'AKC Reunite', value: 'akc' },
    { label: '24PetWatch', value: '24petwatch' },
    { label: 'Other', value: 'other' },
];

export default function Step3Identification({ initialData, onNext }: Step3Props) {
    const [microchipNumber, setMicrochipNumber] = useState(initialData.microchipNumber);
    const [registryProvider, setRegistryProvider] = useState(initialData.registryProvider);
    const [tagId, setTagId] = useState(initialData.tagId);

    const handleNext = () => {
        onNext({
            microchipNumber,
            registryProvider,
            tagId
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerSection}>
                    <Text style={styles.title}>Identification Details</Text>
                    <Text style={styles.subtitle}>Microchip and tag details help bring your pet home safely.</Text>
                </View>

                <View style={styles.formSection}>
                    {/* Microchip */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>MICROCHIP NUMBER</Text>
                        <View style={styles.inputContainer}>
                            <IconSymbol
                                ios_icon_name="memorychip"
                                android_material_icon_name="memory"
                                size={20}
                                color={designSystem.colors.primary[500]}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 985112345678900"
                                placeholderTextColor={designSystem.colors.text.tertiary}
                                keyboardType="number-pad"
                                value={microchipNumber}
                                onChangeText={setMicrochipNumber}
                            />
                        </View>
                        <Text style={styles.hint}>Usually a 9, 10 or 15-digit number.</Text>
                    </View>

                    {/* Registry Provider */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>REGISTRY PROVIDER</Text>
                        <View style={styles.selectContainer}>
                            <IconSymbol
                                ios_icon_name="building.2"
                                android_material_icon_name="domain"
                                size={20}
                                color={designSystem.colors.primary[500]}
                                style={styles.inputIcon}
                            />
                            {Platform.OS === 'ios' ? (
                                // Simplified Select for iOS artifact, usually would use ActionSheet or PickerOverlay
                                <TouchableOpacity style={styles.selectButton}>
                                    <Text style={styles.selectText}>{REGISTRY_PROVIDERS.find(p => p.value === registryProvider)?.label || 'Select provider'}</Text>
                                </TouchableOpacity>
                            ) : (
                                <Picker
                                    selectedValue={registryProvider}
                                    onValueChange={(itemValue) => setRegistryProvider(itemValue)}
                                    style={styles.picker}
                                >
                                    {REGISTRY_PROVIDERS.map((p) => (
                                        <Picker.Item key={p.value} label={p.label} value={p.value} />
                                    ))}
                                </Picker>
                            )}

                        </View>
                    </View>

                    {/* Tag ID */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>COLLAR TAG ID <Text style={styles.optional}>(Optional)</Text></Text>
                        <View style={styles.inputContainer}>
                            <IconSymbol
                                ios_icon_name="tag"
                                android_material_icon_name="sell"
                                size={20}
                                color={designSystem.colors.primary[500]}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Tag or License #"
                                placeholderTextColor={designSystem.colors.text.tertiary}
                                value={tagId}
                                onChangeText={setTagId}
                            />
                        </View>
                    </View>

                    {/* Info Box */}
                    <View style={styles.infoBox}>
                        <IconSymbol ios_icon_name="info.circle" android_material_icon_name="info" size={20} color={designSystem.colors.primary[500]} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoTitle}>Why is this important?</Text>
                            <Text style={styles.infoText}>Microchips are the only permanent form of identification. Keeping this updated ensures your pet can be returned to you.</Text>
                        </View>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    headerSection: {
        marginBottom: 24,
    },
    title: {
        ...designSystem.typography.title.large,
        color: designSystem.colors.text.primary,
        marginBottom: 6,
    },
    subtitle: {
        ...designSystem.typography.body.medium,
        color: designSystem.colors.text.secondary,
    },
    formSection: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.text.secondary,
        letterSpacing: 1,
        fontWeight: '700',
    },
    optional: {
        fontWeight: '400',
        color: designSystem.colors.text.tertiary,
        fontSize: 12,
    },
    inputContainer: {
        position: 'relative',
    },
    inputIcon: {
        position: 'absolute',
        left: 16,
        top: 18,
        zIndex: 1,
    },
    input: {
        backgroundColor: designSystem.colors.neutral[0],
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingLeft: 48,
        paddingVertical: 16,
        fontSize: 16,
        color: designSystem.colors.text.primary,
        ...designSystem.shadows.sm,
    },
    selectContainer: {
        backgroundColor: designSystem.colors.neutral[0],
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        minHeight: 56,
        justifyContent: 'center',
    },
    picker: {
        marginLeft: 40,
    },
    selectButton: {
        paddingLeft: 48,
        paddingVertical: 16,
    },
    selectText: {
        fontSize: 16,
        color: designSystem.colors.text.primary,
    },
    hint: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.text.tertiary,
    },
    infoBox: {
        backgroundColor: designSystem.colors.primary[50],
        borderWidth: 1,
        borderColor: designSystem.colors.primary[100],
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        ...designSystem.typography.label.medium,
        color: designSystem.colors.text.primary,
        fontWeight: '700',
        marginBottom: 2,
    },
    infoText: {
        ...designSystem.typography.body.small,
        color: designSystem.colors.text.secondary,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: designSystem.colors.background.primary,
        borderTopWidth: 1,
        borderTopColor: designSystem.colors.neutral[100],
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    },
    continueButton: {
        backgroundColor: designSystem.colors.primary[500],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        ...designSystem.shadows.md,
    },
    continueButtonText: {
        ...designSystem.typography.title.medium,
        color: designSystem.colors.neutral[0],
        fontWeight: '800',
    },
});
