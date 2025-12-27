import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Card, YStack, XStack, Text, Badge, Divider } from '@/components';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Pet } from '@/types';

interface PetKeyInfoWidgetProps {
    pet: Pet;
    onEdit?: () => void;
}

export default function PetKeyInfoWidget({ pet, onEdit }: PetKeyInfoWidgetProps) {
    return (
        <Card variant="elevated">
            <YStack gap="$4">
                {/* Header */}
                <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$xl" fontWeight="700" color="$textPrimary">
                        Key Info
                    </Text>
                    <TouchableOpacity onPress={onEdit}>
                        <Text fontSize="$sm" fontWeight="600" color="$primary500">
                            Edit
                        </Text>
                    </TouchableOpacity>
                </XStack>

                {/* Microchip */}
                <XStack
                    justifyContent="space-between"
                    alignItems="center"
                    padding="$4"
                    backgroundColor="$gray50"
                    borderRadius="$md"
                >
                    <XStack alignItems="center" gap="$3" flex={1}>
                        <XStack
                            width={40}
                            height={40}
                            borderRadius="$base"
                            backgroundColor="#DBEAFE"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <IconSymbol android_material_icon_name="qr-code" size={20} color="#2563EB" />
                        </XStack>
                        <YStack>
                            <Text fontSize={11} fontWeight="600" color="$textSecondary" textTransform="uppercase" letterSpacing={0.5}>
                                MICROCHIP ID
                            </Text>
                            <Text fontSize="$sm" fontWeight="500" fontFamily="monospace" color="$textPrimary" marginTop={2}>
                                {pet.chip_number || '—'}
                            </Text>
                        </YStack>
                    </XStack>
                    <TouchableOpacity>
                        <IconSymbol android_material_icon_name="content-copy" size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                </XStack>

                {/* Species & Blood Type */}
                <XStack gap="$3">
                    <YStack
                        flex={1}
                        padding="$3"
                        backgroundColor="$gray50"
                        borderRadius="$md"
                        gap="$2"
                    >
                        <XStack alignItems="center" gap="$2">
                            <YStack
                                width={8}
                                height={8}
                                borderRadius="$full"
                                backgroundColor="$success500"
                            />
                            <Text fontSize={11} fontWeight="600" color="$textSecondary" textTransform="uppercase" letterSpacing={0.5}>
                                SPECIES
                            </Text>
                        </XStack>
                        <Text fontSize="$base" fontWeight="600" color="$textPrimary">
                            {pet.species}
                        </Text>
                    </YStack>

                    <YStack
                        flex={1}
                        padding="$3"
                        backgroundColor="$gray50"
                        borderRadius="$md"
                        gap="$2"
                    >
                        <XStack alignItems="center" gap="$2">
                            <YStack
                                width={8}
                                height={8}
                                borderRadius="$full"
                                backgroundColor="$error500"
                            />
                            <Text fontSize={11} fontWeight="600" color="$textSecondary" textTransform="uppercase" letterSpacing={0.5}>
                                BLOOD TYPE
                            </Text>
                        </XStack>
                        <Text fontSize="$base" fontWeight="600" color="$textPrimary">
                            {pet.blood_type || '—'}
                        </Text>
                    </YStack>
                </XStack>

                {/* Color & DOB */}
                <XStack gap="$3">
                    <YStack
                        flex={1}
                        padding="$3"
                        backgroundColor="$gray50"
                        borderRadius="$md"
                        gap="$1"
                    >
                        <Text fontSize={11} fontWeight="600" color="$textSecondary" textTransform="uppercase" letterSpacing={0.5}>
                            COLOR
                        </Text>
                        <Text fontSize="$base" fontWeight="600" color="$textPrimary">
                            {pet.color || '—'}
                        </Text>
                    </YStack>

                    <YStack
                        flex={1}
                        padding="$3"
                        backgroundColor="$gray50"
                        borderRadius="$md"
                        gap="$1"
                    >
                        <Text fontSize={11} fontWeight="600" color="$textSecondary" textTransform="uppercase" letterSpacing={0.5}>
                            DATE OF BIRTH
                        </Text>
                        <Text fontSize="$base" fontWeight="600" color="$textPrimary">
                            {pet.birth_date
                                ? new Date(pet.birth_date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })
                                : '—'
                            }
                        </Text>
                    </YStack>
                </XStack>
            </YStack>
        </Card>
    );
}
