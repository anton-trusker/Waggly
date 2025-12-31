import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pet, Veterinarian, Condition } from '@/types';
import OverviewTabDesktop from './tabs/OverviewTabDesktop';
import HealthTabDesktop from './tabs/HealthTabDesktop';
import DocumentsTabDesktop from './tabs/DocumentsTabDesktop';
import GalleryTabDesktop from './tabs/GalleryTabDesktop';
import SettingsTabDesktop from './tabs/SettingsTabDesktop';

interface DesktopPetDetailProps {
    pet: Pet;
    vets: Veterinarian[];
    conditions: Condition[];
    onEdit: () => void;
    onShare: () => void;
    initialTab?: TabType;
}

export type TabType = 'Overview' | 'Health' | 'Documents' | 'Gallery' | 'Settings';

export default function DesktopPetDetail({ pet, vets, conditions, onEdit, onShare, initialTab = 'Overview' }: DesktopPetDetailProps) {
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Overview':
                return <OverviewTabDesktop pet={pet} vets={vets} />;
            case 'Health':
                return <HealthTabDesktop petId={pet.id} />;
            case 'Documents':
                return <DocumentsTabDesktop petId={pet.id} />;
            case 'Gallery':
                return <GalleryTabDesktop pet={pet} />;
            case 'Settings':
                return <SettingsTabDesktop petId={pet.id} onEdit={onEdit} />;
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            {/* Header Profile Section */}
            <View style={styles.header}>
                <View style={styles.profileInfo}>
                    <View style={styles.avatarContainer}>
                        {pet.photo_url ? (
                            <Image source={{ uri: pet.photo_url }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarEmoji}>🐾</Text>
                            </View>
                        )}
                        <TouchableOpacity style={styles.editPhotoButton}>
                            <Ionicons name="camera" size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={styles.name}>{pet.name}</Text>
                        <Text style={styles.breed}>{pet.breed || pet.species} • {pet.gender || 'Unknown'}</Text>
                    </View>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.secondaryButton} onPress={onShare}>
                        <Ionicons name="share-outline" size={18} color="#374151" />
                        <Text style={styles.buttonText}>Share Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.primaryButton} onPress={onEdit}>
                        <Ionicons name="pencil" size={18} color="#fff" />
                        <Text style={styles.primaryButtonText}>Edit Details</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Navigation Tabs */}
            <View style={styles.tabsContainer}>
                {(['Overview', 'Health', 'Documents', 'Gallery', 'Settings'] as TabType[]).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content Area */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {renderTabContent()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 32,
        maxWidth: 1440,
        width: '100%',
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E0E7FF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#fff',
    },
    avatarEmoji: {
        fontSize: 32,
    },
    editPhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#6366F1',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    name: {
        fontSize: 32,
        fontWeight: '800',
        color: '#111827',
        fontFamily: 'Plus Jakarta Sans',
    },
    breed: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 4,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#6366F1',
        borderRadius: 10,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    primaryButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginBottom: 24,
    },
    tab: {
        paddingVertical: 12,
        paddingHorizontal: 4,
        marginRight: 24,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#6366F1',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    activeTabText: {
        color: '#6366F1',
    },
    content: {
        flex: 1,
    },
});
