import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { usePets } from '@/hooks/usePets';

interface PetSelectorModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (petId: string) => void;
}

export default function PetSelectorModal({ visible, onClose, onSelect }: PetSelectorModalProps) {
    const { pets } = usePets();

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <BlurView intensity={20} style={StyleSheet.absoluteFill} />
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Select Pet</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                        {pets.map((pet) => (
                            <TouchableOpacity
                                key={pet.id}
                                style={styles.petItem}
                                onPress={() => {
                                    onSelect(pet.id);
                                    onClose();
                                }}
                            >
                                <Image
                                    source={{ uri: pet.photo_url || 'https://via.placeholder.com/40' }}
                                    style={styles.petImage}
                                />
                                <View style={styles.petInfo}>
                                    <Text style={styles.petName}>{pet.name}</Text>
                                    <Text style={styles.petBreed}>{pet.breed || 'Unknown Breed'}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#E5E7EB" />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    content: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    list: {
        maxHeight: 400,
    },
    petItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 8,
        backgroundColor: '#F9FAFB',
    },
    petImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        backgroundColor: '#E5E7EB',
    },
    petInfo: {
        flex: 1,
    },
    petName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    petBreed: {
        fontSize: 13,
        color: '#6B7280',
    },
});
