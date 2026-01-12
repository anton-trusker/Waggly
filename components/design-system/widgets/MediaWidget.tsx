import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { designSystem } from '@/constants/designSystem';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface MediaWidgetProps {
    label?: string;
    value?: string | null; // URI
    onChange?: (uri: string | null) => void;
    variant?: 'avatar' | 'cover';
    error?: string;
    editable?: boolean;
}

export const MediaWidget = ({
    label,
    value,
    onChange,
    variant = 'avatar',
    error,
    editable = true,
}: MediaWidgetProps) => {
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        if (!editable) return;

        // Request permissions (handled automatically by expo-image-picker on newer versions, but good practice)
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
                return;
            }
        }

        setLoading(true);
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: variant === 'avatar' ? [1, 1] : [16, 9],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                onChange?.(result.assets[0].uri);
            }
        } catch (e) {
            console.error("ImagePicker Error:", e);
            Alert.alert('Error', 'Failed to pick image');
        } finally {
            setLoading(false);
        }
    };

    const clearImage = () => {
        onChange?.(null);
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={styles.contentContainer}>
                <TouchableOpacity
                    onPress={pickImage}
                    disabled={!editable}
                    activeOpacity={0.7}
                    style={[
                        styles.imageContainer,
                        variant === 'avatar' ? styles.avatarContainer : styles.coverContainer,
                        !!error && styles.errorBorder,
                        !value && styles.placeholderContainer
                    ]}
                >
                    {value ? (
                        <Image source={{ uri: value }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholderContent}>
                            <IconSymbol
                                android_material_icon_name="add-a-photo"
                                ios_icon_name="camera"
                                size={variant === 'avatar' ? 24 : 32}
                                color={designSystem.colors.text.tertiary}
                            />
                            <Text style={styles.placeholderText}>
                                {variant === 'avatar' ? 'Add Photo' : 'Add Cover Photo'}
                            </Text>
                        </View>
                    )}

                    {/* Edit Overlay (optional, maybe only show when value exists) */}
                    {value && editable && (
                        <View style={styles.editOverlay}>
                            <IconSymbol android_material_icon_name="edit" ios_icon_name="pencil" size={12} color="white" />
                        </View>
                    )}
                </TouchableOpacity>

                {value && editable && (
                    <TouchableOpacity onPress={clearImage} style={styles.removeButton}>
                        <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        alignItems: 'center', // Center by default for avatars
    },
    contentContainer: {
        alignItems: 'center',
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
        marginBottom: 8,
        alignSelf: 'flex-start', // If we want label left-aligned
        width: '100%',
    },
    imageContainer: {
        backgroundColor: designSystem.colors.neutral[100],
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    coverContainer: {
        width: '100%',
        height: 150,
        borderRadius: 12,
    },
    placeholderContainer: {
        borderStyle: 'dashed',
        borderWidth: 2,
    },
    placeholderContent: {
        alignItems: 'center',
        gap: 4,
    },
    placeholderText: {
        fontSize: 12,
        color: designSystem.colors.text.tertiary,
        fontWeight: '500',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    errorBorder: {
        borderColor: designSystem.colors.status.error[500],
    },
    errorText: {
        marginTop: 4,
        fontSize: 12,
        color: designSystem.colors.status.error[500],
        alignSelf: 'flex-start',
    },
    editOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 6,
        borderTopLeftRadius: 8,
    },
    removeButton: {
        padding: 4,
    },
    removeText: {
        fontSize: 12,
        color: designSystem.colors.status.error[500],
        fontWeight: '500',
    }
});
