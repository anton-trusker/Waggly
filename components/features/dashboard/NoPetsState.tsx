import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppTheme } from '@/hooks/useAppTheme';
import { router } from 'expo-router';

export default function NoPetsState() {
    const { colors } = useAppTheme();

    const dynamicStyles = {
        circle: { backgroundColor: colors.neutral[100] }, // slate-200/slate-800
        title: { color: colors.text.primary },
        description: { color: colors.text.secondary },
        button: { backgroundColor: colors.primary[500] }, // primary purple
    };

    return (
        <View style={styles.container}>
            <View style={[styles.iconCircle, dynamicStyles.circle]}>
                <IconSymbol
                    ios_icon_name="pawprint.fill"
                    android_material_icon_name="pets"
                    size={64}
                    color={colors.text.tertiary}
                />
            </View>

            <Text style={[styles.title, dynamicStyles.title]}>No Companions Yet</Text>

            <Text style={[styles.description, dynamicStyles.description]}>
                It looks like your pack is waiting to be assembled. Let's get started by adding your first pet!
            </Text>

            <TouchableOpacity
                style={[styles.button, dynamicStyles.button] as any}
                onPress={() => router.push('/(tabs)/pets/add-pet-wizard')}
                activeOpacity={0.9}
            >
                <IconSymbol
                    ios_icon_name="plus"
                    android_material_icon_name="add"
                    size={24}
                    color="#FFFFFF"
                />
                <Text style={styles.buttonText}>Add Your First Pet</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    iconCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
        maxWidth: 300,
    },
    button: {
        width: '100%',
        maxWidth: 320,
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#0EA5E9', // Sky Blue shadow match
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
