import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { designSystem } from '@/constants/designSystem';

interface MobilePageHeaderProps {
    title?: string;
    rightComponent?: React.ReactNode;
}

export default function MobilePageHeader({ title, rightComponent }: MobilePageHeaderProps) {
    return (
        <View style={styles.header}>
            <View style={styles.leftSection}>
                <Image
                    source={require('@/assets/images/icons/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                {title && <Text style={styles.title}>{title}</Text>}
            </View>
            {rightComponent && <View style={styles.rightSection}>{rightComponent}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: designSystem.colors.neutral[0],
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[100],
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    logo: {
        width: 32,
        height: 32,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
        fontFamily: 'Plus Jakarta Sans',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
});
