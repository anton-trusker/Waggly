import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AllergyModal from '@/components/desktop/modals/AllergyModal';

export default function NewAllergyPage() {
    const router = useRouter();
    const { petId } = useLocalSearchParams<{ petId?: string }>();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <AllergyModal
                visible={visible}
                petId={petId}
                onClose={() => {
                    setVisible(false);
                    router.back();
                }}
                onSuccess={() => {
                    setVisible(false);
                    router.back();
                }}
            />
        </View>
    );
}
