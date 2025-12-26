import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pet } from '@/types';
import { designSystem } from '@/constants/designSystem';

interface PetAvatarListProps {
    pets: Pet[];
}

export default function PetAvatarList({ pets }: PetAvatarListProps) {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>Your Pets</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/pets' as any)}>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>
            
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Add New Pet Button (First item for easy access, or Last?) 
                    User said "Add New Pet ... small icon instead of div".
                    Usually "Add" is at the end or beginning. 
                    Let's put it at the beginning for visibility if no pets, or end if list.
                    Common pattern is start or end. Let's put at the START as it encourages adding.
                    Wait, if I have pets, I usually want to see them first.
                    Let's put it at the END like Instagram Stories 'Add' (which is start?) 
                    Let's put it at the END for now.
                */}
                
                {pets.map((pet) => (
                    <TouchableOpacity 
                        key={pet.id} 
                        style={styles.item}
                        onPress={() => router.push(`/(tabs)/pets/pet-detail?id=${pet.id}` as any)}
                    >
                        <View style={styles.avatarContainer}>
                            {pet.photo_url ? (
                                <Image source={{ uri: pet.photo_url }} style={styles.avatar} />
                            ) : (
                                <View style={styles.placeholder}>
                                    <Text style={styles.emoji}>
                                        {pet.species === 'dog' ? '🐕' : 
                                         pet.species === 'cat' ? '🐈' : '🐾'}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.name} numberOfLines={1}>{pet.name}</Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity 
                    style={styles.item}
                    onPress={() => router.push('/(tabs)/pets/add-pet-wizard' as any)}
                >
                    <View style={styles.addButton}>
                        <Ionicons name="add" size={32} color="#6366F1" />
                    </View>
                    <Text style={styles.name}>Add New</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        fontFamily: 'Plus Jakarta Sans',
    },
    viewAll: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
        fontFamily: 'Plus Jakarta Sans',
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 16,
    },
    item: {
        alignItems: 'center',
        width: 70, // Slightly wider than 60 to contain text
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 20, // As requested
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 8,
        overflow: 'hidden', // Ensure image clips to radius
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    placeholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emoji: {
        fontSize: 24,
    },
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#E0E7FF',
        borderStyle: 'dashed',
        marginBottom: 8,
    },
    name: {
        fontSize: 12,
        fontWeight: '500',
        color: '#475569',
        textAlign: 'center',
        width: '100%',
    },
});
