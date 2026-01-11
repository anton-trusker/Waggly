import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DragDropZoneProps {
    onDrop: (files: File[]) => void;
    children?: React.ReactNode;
}

export default function DragDropZone({ onDrop, children }: DragDropZoneProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                onDrop(files);
            }
        },
        [onDrop]
    );

    // Only enable on web
    if (Platform.OS !== 'web') {
        return <>{children}</>;
    }

    return (
        <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
                position: 'relative',
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {isDragging && (
                <View style={styles.dragOverlay}>
                    <View style={styles.dragContent}>
                        <Ionicons name="cloud-upload" size={64} color="#0EA5E9" />
                        <Text style={styles.dragText}>Drop files to upload</Text>
                    </View>
                </View>
            )}
            {children}
        </div>
    );
}

const styles = StyleSheet.create({
    dragOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#0EA5E9',
        borderStyle: 'dashed',
        margin: 8,
    },
    dragContent: {
        alignItems: 'center',
        gap: 16,
    },
    dragText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0EA5E9',
    },
});
