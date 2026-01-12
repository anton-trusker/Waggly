import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { designSystem } from '@/constants/designSystem';
import { useLocale } from '@/hooks/useLocale';

interface AuthHeroPanelProps {
    title?: string;
    subtitle?: string;
    imageSource?: any;
}

const AuthHeroPanel: React.FC<AuthHeroPanelProps> = ({
    title,
    subtitle,
    imageSource = require('@/assets/images/auth-hero.png')
}) => {
    const { t } = useLocale();
    const displayTitle = title || t('auth.hero_title');
    const displaySubtitle = subtitle || t('auth.hero_subtitle');

    return (
        <View style={styles.container}>
            <Image
                source={imageSource}
                style={styles.image}
                resizeMode="cover"
            />
            <LinearGradient
                colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.2)", "transparent"] as any}
                start={{ x: 0.5, y: 1 }}
                end={{ x: 0.5, y: 0 }}
                style={styles.overlay}
            />
            <View style={styles.contentBottom}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>Waggli Premium Pet Care</Text>
                </View>
                <Text style={styles.title}>{displayTitle}</Text>
                <Text style={styles.subtitle}>{displaySubtitle}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#111827',
        overflow: 'hidden',
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    contentBottom: {
        position: 'absolute',
        left: 48,
        right: 48,
        bottom: 64,
    },
    badge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 48,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 16,
        lineHeight: 56,
        letterSpacing: -1,
        fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans' : undefined,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 28,
        maxWidth: 500,
        fontWeight: '500',
    },
});

export default AuthHeroPanel;
