import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface AuthHeroPanelProps {
    title?: string;
    subtitle?: string;
    imageName?: 'pets' | 'onboarding' | 'health';
}

const AuthHeroPanel: React.FC<AuthHeroPanelProps> = ({
    title = 'Welcome to Pawzly',
    subtitle = 'Your ultimate pet care companion',
    imageName = 'pets'
}) => {
    return (
        <LinearGradient
            colors={['#6366F1', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            {/* Logo */}
            <View style={styles.logoContainer}>
                <View style={styles.logoIcon}>
                    <Ionicons name="paw" size={32} color="#fff" />
                </View>
                <Text style={styles.logoText}>Pawzly</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.iconWrapper}>
                    <Ionicons name="heart-circle" size={80} color="rgba(255,255,255,0.3)" />
                </View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>

            {/* Features */}
            <View style={styles.features}>
                <FeatureItem icon="calendar-outline" text="Track appointments & events" />
                <FeatureItem icon="medical-outline" text="Manage health records" />
                <FeatureItem icon="images-outline" text="Store photos & documents" />
            </View>
        </LinearGradient>
    );
};

const FeatureItem: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
    <View style={styles.featureItem}>
        <Ionicons name={icon as any} size={20} color="rgba(255,255,255,0.9)" />
        <Text style={styles.featureText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 48,
        justifyContent: 'space-between',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconWrapper: {
        marginBottom: 32,
    },
    title: {
        fontSize: 40,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 28,
    },
    features: {
        gap: 16,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
    },
});

export default AuthHeroPanel;
