
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Pet } from '@/types';

interface PetCardCompactProps {
    pet: Pet;
    status?: 'healthy' | 'warning' | 'critical';
    onQuickAdd?: (petId: string) => void;
    variant?: 'default' | 'horizontal' | 'large';
    themeColor?: string;
}

export default function PetCardCompact({
    pet,
    status = 'healthy',
    onQuickAdd,
    variant = 'default',
    themeColor = '#F3F4F6'
}: PetCardCompactProps) {
    const router = useRouter();

    // Calculate Age
    const getAge = (dobString?: string) => {
        if (!dobString) return 'Age Unknown';
        const dob = new Date(dobString);
        const diff = Date.now() - dob.getTime();
        const ageDate = new Date(diff);
        const years = Math.abs(ageDate.getUTCFullYear() - 1970);
        if (years === 0) {
            const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
            return `${months} mos`;
        }
        return `${years} yrs`;
    };

    const handlePress = () => {
        router.push(`/(tabs)/pets/${pet.id}` as any);
    };

    const handleQuickAdd = (e: any) => {
        e.stopPropagation();
        onQuickAdd?.(pet.id);
    };

    const getStatusColor = () => {
        switch (status) {
            case 'critical': return '#EF4444';
            case 'warning': return '#F59E0B';
            default: return '#10B981';
        }
    };

    // Large Desktop Card
    if (variant === 'large') {
        return (
            <TouchableOpacity
                style={[styles.largeContainer, { backgroundColor: themeColor }]}
                onPress={handlePress}
                activeOpacity={0.8}
            >
                <View style={styles.largeContentRow}>
                    <View style={[styles.largeImageContainer, { borderColor: 'rgba(0,0,0,0.05)' }]}>
                        {pet.photo_url ? (
                            <Image source={{ uri: pet.photo_url }} style={styles.image} resizeMode="cover" />
                        ) : (
                            <View style={[styles.placeholderContainer, { backgroundColor: 'rgba(255,255,255,0.5)' }]}>
                                <IconSymbol android_material_icon_name="pets" ios_icon_name="pawprint.fill" size={32} color="#6B7280" />
                            </View>
                        )}
                        <View style={[styles.statusDotLarge, { backgroundColor: getStatusColor() }]} />
                    </View>

                    <View style={styles.largeInfo}>
                        <Text style={styles.largeName} numberOfLines={1}>{pet.name}</Text>
                        <View style={styles.largeDetailsRow}>
                            <Text style={styles.largeDetailText}>{pet.breed || 'Unknown Breed'}</Text>
                            <View style={styles.dotSeparator} />
                            <Text style={styles.largeDetailText}>{getAge(pet.date_of_birth)}</Text>
                        </View>
                    </View>

                    <IconSymbol android_material_icon_name="chevron-right" ios_icon_name="chevron.right" size={20} color="#9CA3AF" />
                </View>
            </TouchableOpacity>
        );
    }

    // Horizontal Card (Mobile/Compact)
    if (variant === 'horizontal') {
        return (
            <TouchableOpacity
                style={[styles.horizontalContainer, { backgroundColor: themeColor }]}
                onPress={handlePress}
                activeOpacity={0.8}
            >
                <View style={[styles.horizontalImageContainer, { borderColor: 'rgba(0,0,0,0.05)' }]}>
                    {pet.photo_url ? (
                        <Image source={{ uri: pet.photo_url }} style={styles.image} resizeMode="cover" />
                    ) : (
                        <View style={[styles.placeholderContainer, { backgroundColor: 'rgba(255,255,255,0.5)' }]}>
                            <IconSymbol android_material_icon_name="pets" ios_icon_name="pawprint.fill" size={20} color="#6B7280" />
                        </View>
                    )}
                </View>

                <View style={styles.horizontalContent}>
                    <Text style={styles.horizontalName} numberOfLines={1}>{pet.name}</Text>
                    <Text style={styles.horizontalBreed} numberOfLines={1}>{pet.breed || 'Unknown'}</Text>
                </View>

                {onQuickAdd && (
                    <TouchableOpacity style={styles.horizontalAddButton} onPress={handleQuickAdd}>
                        <IconSymbol android_material_icon_name="add" ios_icon_name="plus" size={16} color="#6B7280" />
                    </TouchableOpacity>
                )}

                <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
            <View style={styles.imageContainer}>
                {onQuickAdd && (
                    <TouchableOpacity style={styles.quickAddButton} onPress={handleQuickAdd}>
                        <IconSymbol android_material_icon_name="add" ios_icon_name="plus" size={14} color="#fff" />
                    </TouchableOpacity>
                )}

                {pet.photo_url ? (
                    <Image source={{ uri: pet.photo_url }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <IconSymbol android_material_icon_name="pets" ios_icon_name="pawprint.fill" size={32} color="#9CA3AF" />
                    </View>
                )}

                <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
            </View>
            <Text style={styles.name} numberOfLines={1}>{pet.name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 8,
        width: 80,
    },
    horizontalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 8,
        paddingRight: 12,
        borderRadius: 16,
        width: 180,
    },
    // Large Desktop Styles
    largeContainer: {
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    largeContentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    largeImageContainer: {
        width: 64, // Bigger than regular horizontal
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        position: 'relative',
    },
    statusDotLarge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#fff',
    },
    largeInfo: {
        flex: 1,
        gap: 4,
    },
    largeName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        fontFamily: 'Plus Jakarta Sans',
    },
    largeDetailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    largeDetailText: {
        fontSize: 13,
        color: '#6B7280',
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: '500',
    },
    dotSeparator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D1D5DB',
    },

    // Existing Styles
    imageContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F3F4F6',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        position: 'relative',
    },
    horizontalImageContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
    },
    horizontalContent: {
        flex: 1,
        justifyContent: 'center',
    },
    statusIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    name: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1F2937',
        textAlign: 'center',
        maxWidth: 80,
        fontFamily: 'Plus Jakarta Sans',
    },
    horizontalName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        fontFamily: 'Plus Jakarta Sans',
    },
    horizontalBreed: {
        fontSize: 11,
        color: '#6B7280',
        fontFamily: 'Plus Jakarta Sans',
    },
    quickAddButton: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#6366F1',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        zIndex: 10,
    },
    horizontalAddButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
