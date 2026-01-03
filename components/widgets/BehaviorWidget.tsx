import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BehaviorTag } from '@/hooks/usePetBehavior';

interface BehaviorWidgetProps {
    tags: BehaviorTag[];
    loading?: boolean;
}

export function BehaviorWidget({ tags, loading }: BehaviorWidgetProps) {
    if (loading) {
        return (
            <View style={[styles.container, styles.loading]}>
                <Text style={styles.loadingText}>Loading behavior...</Text>
            </View>
        );
    }

    const displayTags = tags.length > 0 ? tags.slice(0, 3) : null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.iconCircle}>
                    <IconSymbol android_material_icon_name="psychology" size={18} color="#8B5CF6" />
                </View>
                <Text style={styles.title}>Behavior</Text>
            </View>

            <View style={styles.content}>
                {displayTags ? (
                    <View style={styles.tagsContainer}>
                        {displayTags.map((t) => (
                            <View key={t.id} style={styles.tag}>
                                <Text style={styles.tagText}>{t.tag}</Text>
                            </View>
                        ))}
                        {tags.length > 3 && (
                            <Text style={styles.moreText}>+{tags.length - 3} more</Text>
                        )}
                    </View>
                ) : (
                    <Text style={styles.emptyText}>No behavior traits added yet</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        padding: 12,
        paddingBottom: 14,
        flex: 1,
        minWidth: 140,
        maxWidth: 280,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
    loading: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: 'Plus Jakarta Sans',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 12,
        backgroundColor: '#F5F3FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        fontFamily: 'Plus Jakarta Sans',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    tag: {
        backgroundColor: '#EDE9FE',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    tagText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#7C3AED',
        fontFamily: 'Plus Jakarta Sans',
    },
    moreText: {
        fontSize: 11,
        color: '#9CA3AF',
        fontFamily: 'Plus Jakarta Sans',
        marginTop: 4,
    },
    emptyText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontStyle: 'italic',
        fontFamily: 'Plus Jakarta Sans',
    },
});
