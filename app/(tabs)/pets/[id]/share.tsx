import React from 'react';
import { View, Text, StyleSheet, Share, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { usePets } from '@/hooks/usePets';
import { useLocale } from '@/hooks/useLocale';
import { designSystem } from '@/constants/designSystem';

export default function ShareTab() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { pets } = usePets();
    const pet = pets?.find(p => p.id === id);
    const { t } = useLocale();

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: t('pet_profile.share.message', { url: `https://app.mypawzly.com/pets/${id}` }),
                url: `https://app.mypawzly.com/pets/${id}`,
                title: t('pet_profile.share.message_title'),
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.card}>
                    <IconSymbol android_material_icon_name="share" size={48} color="#6366F1" style={styles.icon} />
                    <Text style={styles.title}>{t('pet_profile.share.title')}</Text>
                    <Text style={styles.description}>
                        {t('pet_profile.share.desc')}
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={onShare}>
                        <Text style={styles.buttonText}>{t('pet_profile.share.action')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: designSystem.colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
    },
    description: {
        fontSize: 16,
        color: designSystem.colors.text.secondary,
        textAlign: 'center',
        maxWidth: '80%',
        marginBottom: 24,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: designSystem.colors.primary[500],
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    shareButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
