import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Card, YStack, XStack, Text, Badge } from '@/components';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Vaccination } from '@/types';

interface PetVaccinationsWidgetProps {
    vaccinations: Vaccination[];
    onSeeAll?: () => void;
}

export default function PetVaccinationsWidget({ vaccinations, onSeeAll }: PetVaccinationsWidgetProps) {
    return (
        <Card variant="elevated">
            <YStack gap="$4">
                <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$xl" fontWeight="700" color="$textPrimary">
                        Vaccinations
                    </Text>
                    <TouchableOpacity onPress={onSeeAll}>
                        <Text fontSize="$sm" fontWeight="600" color="$primary500">
                            See All
                        </Text>
                    </TouchableOpacity>
                </XStack>

                <YStack gap="$3">
                    {vaccinations.length > 0 ? (
                        vaccinations.map(vac => (
                            <XStack
                                key={vac.id}
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
                                    backgroundColor="#D1FAE5"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <IconSymbol android_material_icon_name="vaccines" size={20} color="#059669" />
                                </XStack>
                                <YStack flex={1}>
                                    <Text fontSize="$base" fontWeight="600" color="$textPrimary">
                                        {vac.vaccine_name}
                                    </Text>
                                    <Text fontSize="$sm" color="$textSecondary" marginTop={2}>
                                        {vac.next_due_date
                                            ? new Date(vac.next_due_date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })
                                            : 'No due date'
                                        }
                                    </Text>
                                </YStack>
                                <Badge variant="success">ACTIVE</Badge>
                            </XStack>
                        ))
                    ) : (
                        <Text fontSize="$sm" color="$textTertiary" textAlign="center" paddingVertical="$4">
                            No active vaccinations
                        </Text>
                    )}
                </YStack>
            </YStack>
        </Card>
    );
}
