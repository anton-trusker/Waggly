import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import CalendarGridDesktop from '@/components/desktop/calendar/CalendarGridDesktop';
import CalendarFilters from '@/components/desktop/calendar/CalendarFilters';
import MiniCalendar from '@/components/desktop/calendar/MiniCalendar';
import { useEvents } from '@/hooks/useEvents';

export default function CalendarPage() {
    const { events } = useEvents();
    const { width } = useWindowDimensions();
    const isMobile = width < 1024;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedPets, setSelectedPets] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    // Filter events based on selected pets and types
    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            // Filter by pet
            if (selectedPets.length > 0 && event.pet_id) {
                if (!selectedPets.includes(event.pet_id)) return false;
            }

            // Filter by type
            if (selectedTypes.length > 0 && event.type) {
                if (!selectedTypes.includes(event.type)) return false;
            }

            return true;
        }).map(event => ({
            ...event,
            color: getEventColor(event.type),
        }));
    }, [events, selectedPets, selectedTypes]);

    const getEventColor = (type?: string) => {
        switch (type) {
            case 'medical': return '#6366F1';
            case 'grooming': return '#10B981';
            case 'training': return '#F59E0B';
            case 'feeding': return '#EC4899';
            default: return '#8B5CF6';
        }
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        // Could open a "Add Event" modal here
    };

    const handleEventClick = (event: any) => {
        // Could open event details modal
        console.log('Event clicked:', event);
    };

    return (
        <View style={styles.container}>
            <View style={[styles.content, isMobile && styles.contentMobile]}>
                {/* Main Calendar Area (70%) */}
                <View style={[styles.mainArea, isMobile && styles.mainAreaMobile]}>
                    <CalendarGridDesktop
                        events={filteredEvents}
                        onDateClick={handleDateClick}
                        onEventClick={handleEventClick}
                    />
                </View>

                {/* Sidebar (30%) */}
                <View style={[styles.sidebar, isMobile && styles.sidebarMobile]}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Mini Calendar */}
                        <View style={styles.sidebarSection}>
                            <MiniCalendar
                                selectedDate={selectedDate}
                                onDateSelect={setSelectedDate}
                            />
                        </View>

                        {/* Filters */}
                        <View style={styles.sidebarSection}>
                            <CalendarFilters
                                selectedPets={selectedPets}
                                selectedTypes={selectedTypes}
                                onPetsChange={setSelectedPets}
                                onTypesChange={setSelectedTypes}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
            {isMobile && <View style={{ height: 80 }} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        gap: 24,
        padding: 32,
        maxWidth: 1440,
        alignSelf: 'center',
        width: '100%',
    },
    contentMobile: {
        flexDirection: 'column',
        padding: 16,
    },
    mainArea: {
        flex: 7,
    },
    mainAreaMobile: {
        flex: 0,
        minHeight: 400, // Ensure calendar has some height
    },
    sidebar: {
        flex: 3,
        minWidth: 300,
    },
    sidebarMobile: {
        flex: 0,
        width: '100%',
        minWidth: 'auto' as any,
    },
    sidebarSection: {
        marginBottom: 24,
    },
});
