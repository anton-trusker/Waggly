import React from 'react';
import { Card, YStack, XStack, Text, Badge } from '@/components';

export default function PetPastConditionsWidget() {
    // Mock data for now - can be prop-driven later
    const conditions = [
        { id: '1', title: 'Otitis Externa', date: 'Oct 2023', description: 'Resolved with drops.' },
        { id: '2', title: 'Mild Gastroenteritis', date: 'Feb 2023', description: 'Dietary indiscretion.' },
    ];

    return (
        <Card variant="elevated">
            <YStack gap="$4">
                <Text fontSize="$xl" fontWeight="700" color="$textPrimary">
                    Past Conditions
                </Text>

                <YStack gap="$4">
                    {conditions.map((condition, index) => (
                        <YStack key={condition.id} position="relative" paddingLeft="$8">
                            {/* Timeline line */}
                            {index < conditions.length - 1 && (
                                <YStack
                                    position="absolute"
                                    left={7}
                                    top={20}
                                    bottom={-16}
                                    width={2}
                                    backgroundColor="$borderLight"
                                />
                            )}

                            {/* Timeline dot */}
                            <YStack
                                position="absolute"
                                left={0}
                                top={8}
                                width={16}
                                height={16}
                                borderRadius="$full"
                                backgroundColor="$gray400"
                                borderWidth={3}
                                borderColor="$white"
                            />

                            {/* Content */}
                            <YStack flex={1}>
                                <XStack justifyContent="space-between" alignItems="center" marginBottom="$1">
                                    <Text fontSize="$base" fontWeight="600" color="$textPrimary">
                                        {condition.title}
                                    </Text>
                                    <Badge variant="outline" size="small">{condition.date}</Badge>
                                </XStack>
                                <Text fontSize="$sm" color="$textSecondary">
                                    {condition.description}
                                </Text>
                            </YStack>
                        </YStack>
                    ))}
                </YStack>
            </YStack>
        </Card>
    );
}
