import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useLocale } from '@/hooks/useLocale';

interface AuthHeroPanelProps {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
}

const AuthHeroPanel: React.FC<AuthHeroPanelProps> = ({
    title,
    subtitle,
    imageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKmzQafI0lwQLzWGSp53vEZNjNuyJyB9LYgChbPGhna-8OG4YM1_7pzMqgt2onupgVxvi-9eiOQ_xu3ZX59JGdpX8QVklYPchWxP0WSOLJJ76tbs9NFXTkBi_XfhhDSJt6ejzhqwS879Xl1EMkr7Msuh1-NN5aJyebTXKbPGnZo6aER73ilwh0bHteBY7Y1xbOb0YF0iTbNEDjW3rXwSzupC67bwCYOylhCpqFzoPjJLwbTdZUGbuTPAe2J42-astBgnw7sWaoQPQ'
}) => {
    const { t } = useLocale();
    const displayTitle = title || t('auth.hero_title');
    const displaySubtitle = subtitle || t('auth.hero_subtitle');

    return (
        <View style={styles.container}>
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
            <LinearGradient
                colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.3)", "transparent"] as any}
                start={{ x: 0.5, y: 1 }}
                end={{ x: 0.5, y: 0 }}
                style={styles.overlay}
            />
            <View style={styles.contentBottom}>
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
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        opacity: 0.8,
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
        bottom: 48,
    },
    title: {
        fontSize: 40,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 12,
        lineHeight: 48,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 28,
    },
});

export default AuthHeroPanel;
