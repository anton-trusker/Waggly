import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    useWindowDimensions,
    Image,
    Text,
} from 'react-native';
import { designSystem } from '@/constants/designSystem';
import AuthHeroPanel from '@/components/desktop/auth/AuthHeroPanel';
import { useLocale } from '@/hooks/useLocale';

interface AuthHeroLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export const AuthHeroLayout: React.FC<AuthHeroLayoutProps> = ({
    children,
    title,
    subtitle,
}) => {
    const { width } = useWindowDimensions();
    const isDesktop = width >= designSystem.breakpoints.desktop;
    const { t } = useLocale();

    const renderLogo = () => (
        <View style={styles.header}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('@/assets/images/icons/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            <Text style={styles.appName}>Waggli</Text>
        </View>
    );

    if (isDesktop) {
        return (
            <View style={styles.desktopContainer}>
                {/* Left Side - Form (50%) */}
                <View style={styles.desktopFormPanel}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={styles.keyboardAvoid}
                    >
                        <ScrollView
                            contentContainerStyle={styles.desktopScrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.formWidthContainer}>
                                {renderLogo()}
                                <View style={styles.titleSection}>
                                    <Text style={styles.pageTitle}>{title}</Text>
                                    {subtitle && <Text style={styles.pageSubtitle}>{subtitle}</Text>}
                                </View>
                                {children}
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>

                {/* Right Side - Hero Panel (50%) */}
                <View style={styles.desktopHeroContainer}>
                    <AuthHeroPanel
                        title={t('auth.hero_title')}
                        subtitle={t('auth.hero_subtitle')}
                    />
                </View>
            </View>
        );
    }

    // Mobile
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoid}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {renderLogo()}
                    <View style={styles.formContainer}>
                        <View style={styles.titleSection}>
                            <Text style={styles.pageTitle}>{title}</Text>
                            {subtitle && <Text style={styles.pageSubtitle}>{subtitle}</Text>}
                        </View>
                        {children}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    // Desktop Layout
    desktopContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: designSystem.colors.background.primary,
    },
    desktopHeroContainer: {
        flex: 1,
    },
    desktopFormPanel: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    desktopScrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    formWidthContainer: {
        width: '100%',
        maxWidth: 440,
        paddingHorizontal: 24,
    },

    // Mobile Layout
    container: {
        flex: 1,
        backgroundColor: designSystem.colors.background.secondary,
    },
    keyboardAvoid: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 40,
        alignItems: 'center',
    },

    // Common Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        gap: 12,
    },
    logoContainer: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 40,
        height: 40,
    },
    appName: {
        fontSize: 24,
        fontWeight: '800',
        color: designSystem.colors.text.primary,
        letterSpacing: -0.5,
    },

    // Title Section
    titleSection: {
        marginBottom: 24,
        alignItems: 'center',
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
        textAlign: 'center',
        fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans' : undefined,
    },
    pageSubtitle: {
        fontSize: 16,
        color: designSystem.colors.text.secondary,
        textAlign: 'center',
        marginTop: 8,
    },

    // Form Container (Mobile Card)
    formContainer: {
        width: '100%',
        maxWidth: 440,
        backgroundColor: designSystem.colors.background.primary,
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: designSystem.colors.border.secondary,
    },
});
