
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { usePets } from '@/hooks/usePets';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function WeightSummaryWidget() {
    const { theme } = useAppTheme();
    const { pets, loading } = usePets();

    if (loading) return null;

    return (
        <View style={[styles.container, { borderColor: theme.colors.border.primary, backgroundColor: theme.colors.background.secondary }]}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.secondary.mint }]}>
                    <IconSymbol android_material_icon_name="monitor-weight" ios_icon_name="scalemass" size={20} color={theme.colors.secondary.leaf} />
                </View>
                <Text style={[styles.title, { color: theme.colors.text.primary }]}>Latest Weight</Text>
            </View>

            <ScrollView style={styles.list} nestedScrollEnabled>
                {pets.map((pet, index) => (
                    <View key={pet.id} style={[styles.row, index !== pets.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.colors.border.secondary }]}>
                        <Text style={[styles.petName, { color: theme.colors.text.secondary }]}>{pet.name}</Text>
                        <Text style={[styles.weightValue, { color: theme.colors.text.primary }]}>
                            {pet.weight ? `${pet.weight} kg` : '-'}
                        </Text>
                    </View>
                ))}
                {pets.length === 0 && (
                    <Text style={[styles.emptyText, { color: theme.colors.text.tertiary }]}>No pets added</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        flex: 1,
        minHeight: 180,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.2
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'Plus Jakarta Sans',
    },
    list: {
        maxHeight: 200,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    petName: {
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Plus Jakarta Sans',
    },
    weightValue: {
        fontSize: 14,
        fontWeight: '700',
        fontFamily: 'Plus Jakarta Sans',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
        fontFamily: 'Plus Jakarta Sans',
    }
});
