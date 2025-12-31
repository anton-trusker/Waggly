import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface SearchModalProps {
    visible: boolean;
    onClose: () => void;
}

const MOCK_RESULTS = [
    { id: '1', type: 'pet', title: 'Max', subtitle: 'Dog • Golden Retriever', route: '/(tabs)/pets/1' },
    { id: '2', type: 'pet', title: 'Luna', subtitle: 'Cat • Siamese', route: '/(tabs)/pets/2' },
    { id: '3', type: 'vaccination', title: 'Rabies Vaccination', subtitle: 'Max • Due in 2 weeks', route: '/(tabs)/pets/1' },
    { id: '4', type: 'document', title: 'Insurance Policy.pdf', subtitle: 'Luna • Added yesterday', route: '/(tabs)/documents' },
    { id: '5', type: 'page', title: 'Settings', subtitle: 'Preferences & Account', route: '/(tabs)/profile' },
];

export default function SearchModal({ visible, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const results = query
        ? MOCK_RESULTS.filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.subtitle.toLowerCase().includes(query.toLowerCase()))
        : [];

    const handleSelect = (route: string) => {
        onClose();
        router.push(route);
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.container}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={e => e.stopPropagation()}
                        style={styles.modalContent}
                    >
                        <View style={styles.searchHeader}>
                            <Ionicons name="search" size={20} color="#6B7280" />
                            <TextInput
                                style={styles.input}
                                placeholder="Search pets, records, pages..."
                                placeholderTextColor="#9CA3AF"
                                value={query}
                                onChangeText={setQuery}
                                autoFocus
                            />
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={20} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.resultsList} keyboardShouldPersistTaps="handled">
                            {query && results.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyText}>No results found</Text>
                                </View>
                            ) : (
                                <>
                                    {!query && (
                                        <Text style={styles.sectionTitle}>Suggested</Text>
                                    )}
                                    {(query ? results : MOCK_RESULTS.slice(0, 3)).map((item) => (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={styles.resultItem}
                                            onPress={() => handleSelect(item.route)}
                                        >
                                            <View style={styles.iconContainer}>
                                                <Ionicons
                                                    name={
                                                        item.type === 'pet' ? 'paw' :
                                                            item.type === 'page' ? 'layers' :
                                                                item.type === 'document' ? 'document-text' : 'medical'
                                                    }
                                                    size={20}
                                                    color="#6366F1"
                                                />
                                            </View>
                                            <View style={styles.resultInfo}>
                                                <Text style={styles.resultTitle}>{item.title}</Text>
                                                <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
                                            </View>
                                            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}
                        </ScrollView>

                        <View style={styles.footer}>
                            <View style={styles.shortcut}>
                                <View style={styles.key}>
                                    <Ionicons name="arrow-up" size={12} color="#6B7280" />
                                </View>
                                <View style={styles.key}>
                                    <Ionicons name="arrow-down" size={12} color="#6B7280" />
                                </View>
                                <Text style={styles.shortcutText}>to navigate</Text>
                            </View>
                            <View style={styles.shortcut}>
                                <View style={styles.key}>
                                    <Ionicons name="return-down-back" size={12} color="#6B7280" />
                                </View>
                                <Text style={styles.shortcutText}>to select</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 100,
    },
    container: {
        width: '100%',
        maxWidth: 600,
        paddingHorizontal: 16,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    searchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
        outlineStyle: 'none',
    } as any,
    closeButton: {
        padding: 4,
    },
    resultsList: {
        maxHeight: 400,
        padding: 8,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        marginTop: 8,
        marginBottom: 4,
        paddingHorizontal: 8,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 12,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultInfo: {
        flex: 1,
    },
    resultTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    resultSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    emptyState: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        color: '#6B7280',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 12,
        backgroundColor: '#F9FAFB',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        gap: 16,
    },
    shortcut: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    key: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        minWidth: 20,
        alignItems: 'center',
    },
    shortcutText: {
        fontSize: 12,
        color: '#6B7280',
    },
});
