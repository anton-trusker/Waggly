import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AuthHeroPanel from '@/components/desktop/auth/AuthHeroPanel';
import { useProfile } from '@/hooks/useProfile';
import i18n from '@/lib/i18n';

interface Language {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
}

const LANGUAGES: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

export default function LanguagePage() {
    const router = useRouter();
    const { updateProfile } = useProfile();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const filteredLanguages = LANGUAGES.filter(lang =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleContinue = async () => {
        // Update profile with selected language
        await updateProfile({ language_code: selectedLanguage });

        // Change i18n language
        i18n.changeLanguage(selectedLanguage);

        // Navigate to profile setup
        router.push('/web/onboarding/profile' as any);
    };

    return (
        <View style={[styles.container, isMobile && styles.containerMobile]}>
            {/* Left: Hero Panel */}
            {!isMobile && (
                <View style={styles.heroSection}>
                    <AuthHeroPanel
                        title="Choose Your Language"
                        subtitle="Select your preferred language to personalize your experience"
                    />
                </View>
            )}

            {/* Right: Language Selector */}
            <View style={[styles.formSection, isMobile && styles.formSectionMobile]}>
                <View style={styles.formContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.heading}>Select Language</Text>
                        <Text style={styles.subheading}>Step 1 of 2</Text>
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search languages..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {/* Language Grid */}
                    <ScrollView style={styles.languageGrid} showsVerticalScrollIndicator={false}>
                        <View style={styles.grid}>
                            {filteredLanguages.map((lang) => (
                                <TouchableOpacity
                                    key={lang.code}
                                    style={[
                                        styles.languageCard,
                                        selectedLanguage === lang.code && styles.languageCardSelected,
                                        isMobile && styles.languageCardMobile
                                    ]}
                                    onPress={() => setSelectedLanguage(lang.code)}
                                >
                                    <Text style={styles.flag}>{lang.flag}</Text>
                                    <Text style={styles.languageName}>{lang.nativeName}</Text>
                                    <Text style={styles.languageEnglish}>{lang.name}</Text>
                                    {selectedLanguage === lang.code && (
                                        <View style={styles.checkmark}>
                                            <Ionicons name="checkmark-circle" size={24} color="#6366F1" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Continue Button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleContinue}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    containerMobile: {
        flexDirection: 'column',
    },
    heroSection: {
        flex: 1,
    },
    formSection: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 48,
    },
    formSectionMobile: {
        padding: 24,
    },
    formContainer: {
        flex: 1,
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
    },
    header: {
        marginBottom: 32,
    },
    heading: {
        fontSize: 32,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    subheading: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 48,
        marginBottom: 24,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
    },
    languageGrid: {
        flex: 1,
        marginBottom: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    languageCard: {
        width: '31%', // Fallback for no calc support in some engines, but typically flexBasis is better
        minWidth: 160,
        padding: 20,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#fff',
    },
    languageCardMobile: {
        width: '47%',
        minWidth: 140,
    },
    languageCardSelected: {
        borderColor: '#6366F1',
        backgroundColor: '#F0F6FF',
    },
    flag: {
        fontSize: 48,
        marginBottom: 12,
    },
    languageName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    languageEnglish: {
        fontSize: 14,
        color: '#6B7280',
    },
    checkmark: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    button: {
        backgroundColor: '#6366F1',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
