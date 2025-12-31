import React, { useState, useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions, Modal, TouchableOpacity, Text, ScrollView } from 'react-native';
import CalendarGridDesktop from '@/components/desktop/calendar/CalendarGridDesktop';
import CalendarFilters from '@/components/desktop/calendar/CalendarFilters';
import MiniCalendar from '@/components/desktop/calendar/MiniCalendar';
import UpcomingEventsList from '@/components/desktop/calendar/UpcomingEventsList';
import MobileCalendarHeader from '@/components/desktop/calendar/MobileCalendarHeader';
import { useEvents, type EventType } from '@/hooks/useEvents';
import { designSystem } from '@/constants/designSystem';

import { startOfDay, addMonths, endOfDay, isAfter, isBefore } from 'date-fns';

export default function CalendarPage() {
    const { width } = useWindowDimensions();
    const isMobile = width < 1024;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedPets, setSelectedPets] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<EventType[]>([]);
    const [mobileView, setMobileView] = useState<'timeline' | 'calendar'>('timeline');
    const [showFiltersModal, setShowFiltersModal] = useState(false);

    // Period selection
    const [period, setPeriod] = useState<'3m' | '6m' | '1y' | 'all'>('3m');

    // Fetch all events (unfiltered by date to allow Calendar Grid navigation)
    const { events } = useEvents();

    // Filter events based on selected pets and types (Base Filter)
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

    // Apply Date Period filter specifically for the Upcoming List
    const displayedEvents = useMemo(() => {
        const start = startOfDay(new Date());
        let end: Date | undefined;

        if (period === '3m') {
            end = endOfDay(addMonths(new Date(), 3));
        } else if (period === '6m') {
            end = endOfDay(addMonths(new Date(), 6));
        } else if (period === '1y') {
            end = endOfDay(addMonths(new Date(), 12));
        }

        return filteredEvents.filter(event => {
            const date = new Date(event.dueDate);
            // Filter out past events for "Upcoming List" (optional, but requested "Upcoming in next 3 months")
            if (isBefore(date, start)) return false;

            // Filter end date if set
            if (end && isAfter(date, end)) return false;

            return true;
        });
    }, [filteredEvents, period]);

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
                {/* Desktop/Mobile View */}
                {isMobile ? (
                    // Mobile View
                    <>
                        <View style={{ marginBottom: 16, paddingHorizontal: 16 }}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                                <TouchableOpacity
                                    style={[styles.periodBtn, period === '3m' && styles.periodBtnActive]}
                                    onPress={() => setPeriod('3m')}
                                >
                                    <Text style={[styles.periodBtnText, period === '3m' && styles.periodBtnTextActive]}>3 Months</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.periodBtn, period === '6m' && styles.periodBtnActive]}
                                    onPress={() => setPeriod('6m')}
                                >
                                    <Text style={[styles.periodBtnText, period === '6m' && styles.periodBtnTextActive]}>6 Months</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.periodBtn, period === '1y' && styles.periodBtnActive]}
                                    onPress={() => setPeriod('1y')}
                                >
                                    <Text style={[styles.periodBtnText, period === '1y' && styles.periodBtnTextActive]}>Year</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.periodBtn, period === 'all' && styles.periodBtnActive]}
                                    onPress={() => setPeriod('all')}
                                >
                                    <Text style={[styles.periodBtnText, period === 'all' && styles.periodBtnTextActive]}>All Upcoming</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>

                        {mobileView === 'timeline' ? (
                            <UpcomingEventsList
                                events={displayedEvents}
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
                            {/* Period Selector */}
                            <View style={styles.periodSelector}>
                                <TouchableOpacity
                                    style={[styles.periodBtn, period === '3m' && styles.periodBtnActive]}
                                    onPress={() => setPeriod('3m')}
                                >
                                    <Text style={[styles.periodBtnText, period === '3m' && styles.periodBtnTextActive]}>3 Months</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.periodBtn, period === '6m' && styles.periodBtnActive]}
                                    onPress={() => setPeriod('6m')}
                                >
                                    <Text style={[styles.periodBtnText, period === '6m' && styles.periodBtnTextActive]}>6 Months</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.periodBtn, period === '1y' && styles.periodBtnActive]}
                                    onPress={() => setPeriod('1y')}
                                >
                                    <Text style={[styles.periodBtnText, period === '1y' && styles.periodBtnTextActive]}>Year</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.periodBtn, period === 'all' && styles.periodBtnActive]}
                                    onPress={() => setPeriod('all')}
                                >
                                    <Text style={[styles.periodBtnText, period === 'all' && styles.periodBtnTextActive]}>All Upcoming</Text>
                                </TouchableOpacity>
                            </View>

                            <UpcomingEventsList
                                events={displayedEvents}
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
    periodSelector: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 24,
        backgroundColor: '#F3F4F6',
        padding: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    periodBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    periodBtnActive: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    periodBtnText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#6B7280',
    },
    periodBtnTextActive: {
        color: '#111827',
        fontWeight: '600',
    },
});
