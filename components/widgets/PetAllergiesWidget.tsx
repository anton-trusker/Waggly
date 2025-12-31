import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Card, YStack, XStack, Text, Badge } from '@/components';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Allergy } from '@/types';

interface PetAllergiesWidgetProps {
    allergies: Allergy[];
    onAdd?: () => void;
    onRemove?: (allergyId: string) => void;
}

export default function PetAllergiesWidget({ allergies, onAdd, onRemove }: PetAllergiesWidgetProps) {
    return (
        <Card variant="elevated">
            <YStack gap="$4">
                <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$xl" fontWeight="700" color="$textPrimary">
                        Allergies
                    </Text>
                    <TouchableOpacity onPress={onAdd}>
                        <XStack
                            width={28}
                            height={28}
                            borderRadius="$full"
                            backgroundColor="$primary50"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <IconSymbol android_material_icon_name="add" size={16} color="#6366F1" />
                        </XStack>
                    </TouchableOpacity>
                </XStack>

                <XStack flexWrap="wrap" gap="$2">
                    {allergies.length > 0 ? (
                        allergies.map(a => (
                            <XStack
                                key={a.id}
                                alignItems="center"
                                gap="$2"
                                paddingHorizontal="$3"
                                paddingVertical="$1.5"
                                borderRadius="$md"
                                backgroundColor="$error50"
                                borderWidth={1}
                                borderColor="$error100"
                            >
                                <Text fontSize={11} fontWeight="600" color="$error500" letterSpacing={0.5}>
                                    {a.allergen?.toUpperCase() || ''}
                                </Text>
                                <TouchableOpacity onPress={() => onRemove?.(a.id)}>
                                    <IconSymbol android_material_icon_name="close" size={14} color="#EF4444" />
                                </TouchableOpacity>
                            </XStack>
                        ))
                    ) : (
                        <Badge variant="outline">NO ALLERGIES</Badge>
                    )}
                </XStack>
            </YStack>
        </Card>
    );
}
