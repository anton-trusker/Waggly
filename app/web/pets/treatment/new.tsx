import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import TreatmentFormModal from '@/components/desktop/modals/TreatmentFormModal';

export default function NewTreatmentPage() {
  const router = useRouter();
  const { petId } = useLocalSearchParams<{ petId?: string }>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <TreatmentFormModal
        visible={visible}
        petId={petId}
        onClose={() => {
          setVisible(false);
          router.back();
        }}
      />
    </View>
  );
}
