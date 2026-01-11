import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { designSystem } from '@/constants/designSystem';
import { YStack, XStack, Text } from '@/components';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Vaccination } from '@/types';

interface PetHealthStatusWidgetProps {
    nextVaccineDue?: Vaccination;
}

export default function PetHealthStatusWidget({ nextVaccineDue }: PetHealthStatusWidgetProps) {
    return (
        <LinearGradient
            colors={[designSystem.colors.primary[500], designSystem.colors.secondary[500]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 4,
            }}
        >
            <XStack justifyContent="space-between" alignItems="flex-start">
                <YStack>
                    <Text
                        fontSize={11}
                        fontWeight="600"
                        color="white"
                        letterSpacing={1}
                        marginBottom={8}
                        textTransform="uppercase"
                    >
                        HEALTH STATUS
                    </Text>
                    <Text fontSize="$2xl" fontWeight="700" color="$white" marginBottom={8}>
                        Vaccines Up to Date
                    </Text>
                    {nextVaccineDue && (
                        <XStack alignItems="center" gap="$2">
                            <IconSymbol android_material_icon_name="event" size={16} color="white" />
                            <Text fontSize="$sm" color="white" fontWeight="500">
                                Next Due: {new Date(nextVaccineDue.next_due_date!).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </Text>
                        </XStack>
                    )}
                </YStack>
                <YStack
                    width={48}
                    height={48}
                    borderRadius="$full"
                    backgroundColor="rgba(255, 255, 255, 0.2)"
                    alignItems="center"
                    justifyContent="center"
                >
                    <IconSymbol android_material_icon_name="verified-user" size={24} color="white" />
                </YStack>
            </XStack>
        </LinearGradient>
    );
}
