import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { getColor } from '@/utils/designSystem';
import { useLocale } from '@/hooks/useLocale';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AppHeader from '@/components/layout/AppHeader';
import { format } from 'date-fns';
import { usePets } from '@/hooks/usePets';

export default function EventDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { t, locale } = useLocale();
    const { pets } = usePets();
    const [loading, setLoading] = useState(true);
    const [eventData, setEventData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id && pets.length > 0) {
            fetchEventDetails();
        }
    }, [id, pets]);

    const fetchEventDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const parts = id.split(':');
            const type = parts[0];
            const actualId = parts[1];
            const extra = parts[2];

            console.log('🔍 Fetching event details for:', { type, actualId, extra });

            let data: any = null;
            let fetchError = null;

            switch (type) {
                case 'vaccination':
                    ({ data, error: fetchError } = await supabase
                        .from('vaccinations')
                        .select('*')
                        .eq('id', actualId)
                        .single());
                    if (data) data.displayType = 'vaccination';
                    break;
                case 'treatment-start':
                case 'treatment-end':
                    ({ data, error: fetchError } = await supabase
                        .from('treatments')
                        .select('*')
                        .eq('id', actualId)
                        .single());
                    if (data) data.displayType = 'treatment';
                    break;
                case 'visit':
                    ({ data, error: fetchError } = await supabase
                        .from('medical_visits')
                        .select('*')
                        .eq('id', actualId)
                        .single());
                    if (data) data.displayType = 'vet';
                    break;
                case 'event':
                    ({ data, error: fetchError } = await supabase
                        .from('events')
                        .select('*')
                        .eq('id', actualId)
                        .single());
                    if (data) data.displayType = data.type || 'other';
                    break;
                case 'birthday':
                    const pet = pets.find(p => p.id === actualId);
                    if (pet) {
                        const age = parseInt(extra) - new Date(pet.date_of_birth || new Date()).getFullYear();
                        data = {
                            title: t('calendar.birthday_title', { name: pet.name }),
                            pet_id: pet.id,
                            pet_name: pet.name,
                            date: `${extra}-${format(new Date(pet.date_of_birth || new Date()), 'MM-dd')}`,
                            displayType: 'other',
                            notes: t('calendar.birthday_notes', { age })
                        };
                    }
                    break;
                default:
                    throw new Error('Unknown event type: ' + type);
            }

            if (fetchError) {
                console.error('❌ Supabase fetch error:', fetchError);
                throw fetchError;
            }
            if (!data) throw new Error('Event not found');

            // Find pet name manually if missing
            if (!data.pet_name && data.pet_id) {
                const pet = pets.find(p => p.id === data.pet_id);
                data.pet_name = pet?.name || 'Unknown Pet';
            }

            console.log('✅ Event data loaded:', data);
            setEventData(data);
        } catch (err: any) {
            console.error('❌ Error fetching event details:', err);
            setError(err.message || 'Failed to load event details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <AppHeader title={t('calendar.event_details')} showBack />
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={designSystem.colors.primary[500]} />
                </View>
            </View>
        );
    }

    if (error || (!eventData && !loading)) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <AppHeader title={t('calendar.event_details')} showBack />
                <View style={styles.centered}>
                    <IconSymbol
                        ios_icon_name="exclamationmark.circle"
                        android_material_icon_name="error-outline"
                        size={48}
                        color={designSystem.colors.error[500] as any}
                    />
                    <Text style={styles.errorText}>{error || 'Failed to load event details'}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchEventDetails}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (!eventData) return null;

    const typeConfig: any = {
        vaccination: { ios: 'syringe', android: 'vaccines', color: designSystem.colors.success[500] },
        treatment: { ios: 'pill', android: 'medication', color: designSystem.colors.warning[500] },
        vet: { ios: 'medical.bag', android: 'medical_services', color: designSystem.colors.primary[500] },
        grooming: { ios: 'scissors', android: 'content_cut', color: designSystem.colors.secondary[500] },
        walking: { ios: 'figure.walk', android: 'directions_walk', color: designSystem.colors.primary[400] },
        other: { ios: 'calendar', android: 'event', color: designSystem.colors.neutral[500] },
    };

    const config = typeConfig[eventData.displayType] || typeConfig.other;
    const eventDateStr = eventData.date || eventData.due_date || eventData.start_time || eventData.next_due_date || eventData.measured_at || eventData.date_given;
    const eventDate = eventDateStr ? new Date(eventDateStr) : new Date();

    const title = eventData.title ||
        eventData.vaccine_name ||
        eventData.treatment_name ||
        eventData.reason ||
        (eventData.displayType === 'vaccination' ? t('pet_profile.health.vaccinations.title') : 'Event');

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <AppHeader title={t('calendar.event_details')} showBack />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={[styles.iconContainer, { backgroundColor: `${config.color} 15` }]}>
                        <IconSymbol
                            ios_icon_name={config.ios}
                            android_material_icon_name={config.android}
                            size={32}
                            color={config.color}
                        />
                    </View>
                    <Text style={styles.title}>{title}</Text>
                    <View style={[styles.badge, { backgroundColor: `${config.color} 15` }]}>
                        <Text style={[styles.badgeText, { color: config.color }]}>
                            {t(`calendar.event_types.${eventData.displayType}`)}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <DetailRow
                        iosIcon="pawprint"
                        androidIcon="pets"
                        label={t('common.pet')}
                        value={eventData.pet_name || 'Unknown Pet'}
                    />
                    <DetailRow
                        iosIcon="calendar"
                        androidIcon="event"
                        label={t('common.date')}
                        value={format(eventDate, 'MMMM dd, yyyy')}
                    />
                    {(eventData.time || eventData.start_time || eventData.visit_time || eventData.administered_time) && (
                        <DetailRow
                            iosIcon="clock"
                            androidIcon="schedule"
                            label={t('common.time')}
                            value={eventData.time || (eventData.start_time ? format(new Date(eventData.start_time), 'hh:mm a') : (eventData.visit_time || eventData.administered_time))}
                        />
                    )}
                    {(eventData.location || eventData.clinic_name || eventData.business_name) && (
                        <DetailRow
                            iosIcon="mappin.and.ellipse"
                            androidIcon="location_on"
                            label={t('common.location')}
                            value={eventData.location || eventData.clinic_name || eventData.business_name}
                        />
                    )}
                </View>

                {(eventData.notes || eventData.description) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('common.notes')}</Text>
                        <View style={styles.notesCard}>
                            <Text style={styles.notesText}>{eventData.notes || eventData.description}</Text>
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

function DetailRow({ iosIcon, androidIcon, label, value }: { iosIcon: string, androidIcon: any, label: string, value: string }) {
    return (
        <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
                <IconSymbol
                    ios_icon_name={iosIcon}
                    android_material_icon_name={androidIcon}
                    size={20}
                    color={designSystem.colors.text.tertiary}
                />
            </View>
            <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={styles.detailValue}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: designSystem.colors.neutral[50],
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: designSystem.colors.neutral[50],
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
        textAlign: 'center',
        marginBottom: 8,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        ...designSystem.shadows.sm,
        marginBottom: 24,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[100],
    },
    detailIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: designSystem.colors.neutral[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    detailTextContainer: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: designSystem.colors.text.tertiary,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
        marginBottom: 12,
    },
    notesCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        ...designSystem.shadows.sm,
    },
    notesText: {
        fontSize: 15,
        color: designSystem.colors.text.secondary,
        lineHeight: 22,
    },
    errorText: {
        fontSize: 16,
        color: designSystem.colors.text.secondary,
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: designSystem.colors.primary[500],
        borderRadius: 8,
    },
    retryText: {
        color: '#fff',
        fontWeight: '600',
    },
});
