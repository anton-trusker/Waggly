import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';

interface FormImagePickerProps {
    label?: string;
    value: string | null;
    onChange: (uri: string) => void;
    placeholder?: string;
    error?: string;
    helperText?: string;
    aspect?: [number, number];
    allowsEditing?: boolean;
}

export default function FormImagePicker({
    label,
    value,
    onChange,
    placeholder = 'Tap to select photo',
    error,
    helperText,
    aspect = [1, 1],
    allowsEditing = true,
}: FormImagePickerProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';
    const [uploading, setUploading] = useState(false);

    const effectiveColors = isDark
        ? {
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            border: designSystem.colors.neutral[700],
            background: designSystem.colors.neutral[800],
            placeholder: designSystem.colors.neutral[500],
            error: designSystem.colors.error[400],
        }
        : {
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            border: designSystem.colors.neutral[300],
            background: designSystem.colors.neutral[100],
            placeholder: designSystem.colors.neutral[400],
            error: designSystem.colors.error[500],
        };

    const pickImage = async () => {
        try {
            // Request permissions
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Please grant camera roll permissions to select a photo.'
                );
                return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing,
                aspect,
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                onChange(result.assets[0].uri);
            }
        } catch (err) {
            console.error('Error picking image:', err);
            Alert.alert('Error', 'Failed to select image');
        }
    };

    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Please grant camera permissions to take a photo.'
                );
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing,
                aspect,
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                onChange(result.assets[0].uri);
            }
        } catch (err) {
            console.error('Error taking photo:', err);
            Alert.alert('Error', 'Failed to take photo');
        }
    };

    const showOptions = () => {
        if (Platform.OS === 'web') {
            pickImage();
            return;
        }

        Alert.alert(
            'Select Photo',
            'Choose a photo from your library or take a new one',
            [
                { text: 'Camera', onPress: takePhoto },
                { text: 'Photo Library', onPress: pickImage },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {label && (
                <Text style={[styles.label, { color: effectiveColors.text }]}>
                    {label}
                </Text>
            )}

            <TouchableOpacity
                onPress={showOptions}
                activeOpacity={0.7}
                style={[
                    styles.imageContainer,
                    {
                        borderColor: error ? effectiveColors.error : effectiveColors.border,
                        backgroundColor: effectiveColors.background,
                    },
                ]}
            >
                {value ? (
                    <Image source={{ uri: value }} style={styles.image} />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <IconSymbol
                            ios_icon_name="camera.fill"
                            android_material_icon_name="photo_camera"
                            size={40}
                            color={effectiveColors.placeholder}
                        />
                        <Text
                            style={[styles.placeholderText, { color: effectiveColors.placeholder }]}
                        >
                            {placeholder}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            {error && (
                <Text style={[styles.errorText, { color: effectiveColors.error }]}>
                    {error}
                </Text>
            )}

            {helperText && !error && (
                <Text style={[styles.helperText, { color: effectiveColors.textSecondary }]}>
                    {helperText}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        maxWidth: 200,
        borderRadius: 16,
        borderWidth: 2,
        borderStyle: 'dashed',
        overflow: 'hidden',
        alignSelf: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    placeholderText: {
        fontSize: 14,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
    helperText: {
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
});
