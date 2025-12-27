import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Card, YStack, XStack, Text, EmptyState } from '@/components';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Event } from '@/types';

interface PetUpcomingEventsWidgetProps {
    events: Event[];
    onViewAll?: () => void;
}

export default function PetUpcomingEventsWidget({ events, onViewAll }: PetUpcomingEventsWidgetProps) {
    return (
        <Card variant="elevated">
            <YStack gap="$4">
                <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$xl" fontWeight="700" color="$textPrimary">
                        Upcoming Events
                    </Text>
                    <TouchableOpacity onPress={onViewAll}>
                        <Text fontSize="$sm" fontWeight="600" color="$primary500">
                            View All
                        </Text>
                    </TouchableOpacity>
                </XStack>

                <YStack gap="$3">
                    {events.length > 0 ? (
                        events.map(event => (
                            <XStack
                                key={event.id}
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
                                    backgroundColor="#FEF3C7"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <IconSymbol android_material_icon_name="event" size={20} color="#D97706" />
                                </XStack>
                                <YStack flex={1}>
                                    <Text fontSize="$base" fontWeight="600" color="$textPrimary">
                                        {event.title}
                                    </Text>
                                    <Text fontSize="$sm" color="$textSecondary" marginTop={2}>
                                        {new Date(event.start_time).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit'
                                        })}
                                    </Text>
                                </YStack>
                            </XStack>
                        ))
                    ) : (
                        <Text fontSize="$sm" color="$textTertiary" textAlign="center" paddingVertical="$4">
                            No upcoming events
                        </Text>
                    )}
                </YStack>
            </YStack>
        </Card>
    );
}
