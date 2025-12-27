import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import VaccinationFormModal from '@/components/desktop/modals/VaccinationFormModal';

export default function NewVaccinationPage() {
  const router = useRouter();
  const { petId } = useLocalSearchParams<{ petId?: string }>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <VaccinationFormModal
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
