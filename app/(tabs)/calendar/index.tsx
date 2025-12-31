import React, { useState, useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions, Modal, TouchableOpacity, Text } from 'react-native';
import CalendarGridDesktop from '@/components/desktop/calendar/CalendarGridDesktop';
import CalendarFilters from '@/components/desktop/calendar/CalendarFilters';
import MiniCalendar from '@/components/desktop/calendar/MiniCalendar';
import UpcomingEventsList from '@/components/desktop/calendar/UpcomingEventsList';
import MobileCalendarHeader from '@/components/desktop/calendar/MobileCalendarHeader';
import { useEvents, type EventType } from '@/hooks/useEvents';
import { designSystem } from '@/constants/designSystem';

export default function CalendarPage() {
    const { events } = useEvents();
    const { width } = useWindowDimensions();
    const isMobile = width < 1024;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedPets, setSelectedPets] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<EventType[]>([]);
    const [mobileView, setMobileView] = useState<'timeline' | 'calendar'>('timeline');
    const [showFiltersModal, setShowFiltersModal] = useState(false);

    // Filter events based on selected pets and types
    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            // Filter by pet
            if (selectedPets.length > 0 && event.petId) {
                if (!selectedPets.includes(event.petId)) return false;
            }

            // Filter by type
            if (selectedTypes.length > 0 && event.type) {
                if (!selectedTypes.includes(event.type)) return false;
            }

            return true;
        });
    }, [events, selectedPets, selectedTypes]);

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
    };

    const handleEventClick = (event: any) => {
        console.log('Event clicked:', event);
    };

    const hasActiveFilters = selectedPets.length > 0 || selectedTypes.length > 0;

    return (
        <View style={styles.container}>
            {/* Mobile Header */}
            {isMobile && (
                <MobileCalendarHeader
                    currentView={mobileView}
                    onViewChange={setMobileView}
                    onFilterPress={() => setShowFiltersModal(true)}
                    hasActiveFilters={hasActiveFilters}
                />
            )}

            <View style={[styles.content, isMobile && styles.contentMobile]}>
                {/* Desktop/Mobile View */}
                {isMobile ? (
                    // Mobile View - Timeline or Calendar
                    <>
                        {mobileView === 'timeline' ? (
                            <UpcomingEventsList
                                events={filteredEvents}
                                onEventClick={handleEventClick}
                            />
                        ) : (
                            <CalendarGridDesktop
                                events={filteredEvents}
                                onDateClick={handleDateClick}
                                onEventClick={handleEventClick}
                            />
                        )}
                    </>
                ) : (
                    // Desktop View - Upcoming Events (Left) + Sidebar (Right)
                    <>
                        {/* Main Area - Upcoming Events (70%) */}
                        <View style={styles.mainArea}>
                            <UpcomingEventsList
                                events={filteredEvents}
                                onEventClick={handleEventClick}
                            />
                        </View>

                        {/* Sidebar (30%) */}
                        <View style={styles.sidebar}>
                            {/* Mini Calendar with Event Dots */}
                            <View style={styles.sidebarSection}>
                                <MiniCalendar
                                    selectedDate={selectedDate}
                                    onDateSelect={setSelectedDate}
                                    events={filteredEvents as any}
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
                        </View>
                    </>
                )}
            </View>

            {/* Mobile Filters Modal */}
            {isMobile && (
                <Modal
                    visible={showFiltersModal}
                    animationType="slide"
                    presentationStyle="pageSheet"
                    onRequestClose={() => setShowFiltersModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filters</Text>
                            <TouchableOpacity onPress={() => setShowFiltersModal(false)}>
                                <Text style={styles.modalDone}>Done</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalContent}>
                            <CalendarFilters
                                selectedPets={selectedPets}
                                selectedTypes={selectedTypes}
                                onPetsChange={setSelectedPets}
                                onTypesChange={setSelectedTypes}
                            />
                        </View>
                    </View>
                </Modal>
            )}

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
        padding: 0,
        gap: 0,
    },
    mainArea: {
        flex: 7,
        backgroundColor: designSystem.colors.neutral[0],
        borderRadius: 16,
        padding: 24,
        ...designSystem.shadows.md,
    },
    sidebar: {
        flex: 3,
        minWidth: 320,
    },
    sidebarSection: {
        marginBottom: 24,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: designSystem.colors.neutral[0],
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[100],
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
    },
    modalDone: {
        fontSize: 16,
        fontWeight: '600',
        color: designSystem.colors.primary[500],
    },
    modalContent: {
        flex: 1,
        padding: 16,
    },
});
