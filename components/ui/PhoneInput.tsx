import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Image } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import { COUNTRIES, Country } from '@/constants/countries';
import { useAppTheme } from '@/hooks/useAppTheme';

interface PhoneInputProps {
    value: string;
    onChangeText: (text: string) => void;
    defaultCountryCode?: string;
    error?: string;
}

export default function PhoneInput({ value, onChangeText, defaultCountryCode = 'US', error }: PhoneInputProps) {
    const { colors } = useAppTheme();
    const [selectedCountry, setSelectedCountry] = useState<Country>(
        COUNTRIES.find(c => c.code === defaultCountryCode) || COUNTRIES.find(c => c.code === 'US') || COUNTRIES[0]
    );
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        setModalVisible(false);
        setSearchQuery('');
    };

    const filteredCountries = COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.dialCode.includes(searchQuery) ||
        country.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const dynamicStyles = {
        inputContainer: {
            backgroundColor: colors.neutral[0],
            borderColor: colors.neutral[200],
        },
        dialCode: {
            color: colors.text.primary,
        },
        divider: {
            backgroundColor: colors.neutral[200],
        },
        input: {
            color: colors.text.primary,
        },
        inputError: {
            borderColor: colors.error[500],
        },
        errorText: {
            color: colors.error[500],
        },
        modalContainer: {
            backgroundColor: colors.background.primary,
        },
        modalHeader: {
            borderBottomColor: colors.neutral[100],
        },
        modalTitle: {
            color: colors.text.primary,
        },
        countryItem: {
            borderBottomColor: colors.neutral[100],
        },
        itemName: {
            color: colors.text.primary,
        },
        itemDialCode: {
            color: colors.text.secondary,
        },
        searchContainer: {
            backgroundColor: colors.neutral[50], // Or a dedicated surface color
        },
        searchInput: {
            color: colors.text.primary,
        },
        placeholder: colors.text.tertiary
    };

    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, dynamicStyles.inputContainer, error && dynamicStyles.inputError]}>
                <TouchableOpacity
                    style={styles.countryButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.flag}>{selectedCountry.flag}</Text>
                    <Text style={[styles.dialCode, dynamicStyles.dialCode]}>{selectedCountry.dialCode}</Text>
                    <IconSymbol
                        ios_icon_name="chevron.down"
                        android_material_icon_name="arrow-drop-down"
                        size={16}
                        color={colors.text.secondary}
                    />
                </TouchableOpacity>

                <View style={[styles.divider, dynamicStyles.divider]} />

                <TextInput
                    style={[styles.input, dynamicStyles.input]}
                    placeholder="Phone number"
                    placeholderTextColor={dynamicStyles.placeholder}
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChangeText}
                />
            </View>
            {error && <Text style={[styles.errorText, dynamicStyles.errorText]}>{error}</Text>}

            <Modal
                visible={modalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={[styles.modalContainer, dynamicStyles.modalContainer]}>
                    <View style={[styles.modalHeader, dynamicStyles.modalHeader]}>
                        <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>Select Country</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <IconSymbol ios_icon_name="xmark" android_material_icon_name="close" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.searchContainer, dynamicStyles.searchContainer]}>
                        <IconSymbol ios_icon_name="magnifyingglass" android_material_icon_name="search" size={20} color={colors.text.tertiary} />
                        <TextInput
                            style={[styles.searchInput, dynamicStyles.searchInput]}
                            placeholder="Search country name or code..."
                            placeholderTextColor={dynamicStyles.placeholder}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus={false}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <IconSymbol ios_icon_name="xmark.circle.fill" android_material_icon_name="cancel" size={16} color={colors.text.tertiary} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <FlashList
                        data={filteredCountries}
                        keyExtractor={item => item.code}
                        estimatedItemSize={65}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.countryItem, dynamicStyles.countryItem]}
                                onPress={() => handleCountrySelect(item)}
                            >
                                <Text style={styles.itemFlag}>{item.flag}</Text>
                                <Text style={[styles.itemName, dynamicStyles.itemName]}>{item.name}</Text>
                                <Text style={[styles.itemDialCode, dynamicStyles.itemDialCode]}>{item.dialCode}</Text>
                                {item.code === selectedCountry.code && (
                                    <IconSymbol ios_icon_name="checkmark" android_material_icon_name="check" size={20} color={colors.primary[500]} />
                                )}
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: designSystem.colors.neutral[0],
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 12,
        height: 56,
        ...designSystem.shadows.sm,
    },
    inputError: {
        borderColor: designSystem.colors.error[500],
    },
    countryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 12,
        gap: 8,
        height: '100%',
    },
    flag: {
        fontSize: 24,
    },
    dialCode: {
        ...designSystem.typography.body.medium,
        color: designSystem.colors.text.primary,
        fontWeight: '600',
    },
    divider: {
        width: 1,
        height: '60%',
        backgroundColor: designSystem.colors.neutral[200],
    },
    input: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 16,
        fontSize: 16,
        color: designSystem.colors.text.primary,
    },
    errorText: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.error[500],
        marginTop: 4,
        marginLeft: 4,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: designSystem.colors.background.primary,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[100],
    },
    modalTitle: {
        ...designSystem.typography.title.large,
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[100],
        gap: 12,
    },
    itemFlag: {
        fontSize: 24,
    },
    itemName: {
        flex: 1,
        ...designSystem.typography.body.large,
    },
    itemDialCode: {
        ...designSystem.typography.body.medium,
        color: designSystem.colors.text.secondary,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: designSystem.colors.neutral[50],
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 12,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: designSystem.colors.text.primary,
        padding: 0,
        height: 24,
    },
});
