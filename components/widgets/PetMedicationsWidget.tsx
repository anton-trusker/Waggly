import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Card, YStack, XStack, Text, Badge } from '@/components';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Medication } from '@/types';

interface PetMedicationsWidgetProps {
    medications: Medication[];
    onManage?: () => void;
}

export default function PetMedicationsWidget({ medications, onManage }: PetMedicationsWidgetProps) {
    return (
        <Card variant="elevated">
            <YStack gap="$4">
                <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$xl" fontWeight="700" color="$textPrimary">
                        Current Medications
                    </Text>
                    <TouchableOpacity onPress={onManage}>
                        <Text fontSize="$sm" fontWeight="600" color="$primary500">
                            Manage
                        </Text>
                    </TouchableOpacity>
                </XStack>

                <YStack gap="$3">
                    {medications.length > 0 ? (
                        medications.map(med => (
                            <XStack
                                key={med.id}
                                alignItems="center"
                                gap="$3"
                                paddingVertical="$3"
                                paddingHorizontal="$4"
                                backgroundColor="$gray50"
                                borderRadius="$md"
                            >
                                <XStack
                                    width={40}
                                    height={40}
                                    borderRadius="$base"
                                    backgroundColor="#E0E7FF"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <IconSymbol android_material_icon_name="medication" size={20} color="#4F46E5" />
                                </XStack>
                                <YStack flex={1}>
                                    <Text fontSize="$base" fontWeight="600" color="$textPrimary">
                                        {med.name}
                                    </Text>
                                    <Text fontSize="$sm" color="$textSecondary" marginTop={2}>
                                        {med.dosage_value}{med.dosage_unit} • {med.frequency}
                                    </Text>
                                </YStack>
                                <Badge variant="primary">DAILY</Badge>
                            </XStack>
                        ))
                    ) : (
                        <Text fontSize="$sm" color="$textTertiary" textAlign="center" paddingVertical="$4">
                            No active medications
                        </Text>
                    )}
                </YStack>
            </YStack>
        </Card>
    );
}
