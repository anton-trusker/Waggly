import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type {
    EmergencyContact,
    EmergencyContactFormData,
    EmergencyContactType
} from '@/types/passport';

export interface UseEmergencyContactsReturn {
    contacts: EmergencyContact[];
    loading: boolean;
    error: Error | null;
    addContact: (data: EmergencyContactFormData) => Promise<void>;
    updateContact: (id: string, data: Partial<EmergencyContactFormData>) => Promise<void>;
    deleteContact: (id: string) => Promise<void>;
}

export function useEmergencyContacts(petId: string): UseEmergencyContactsReturn {
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchContacts = useCallback(async () => {
        if (!petId) {
            setError(new Error('Pet ID is required'));
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('emergency_contacts')
                .select('*')
                .eq('pet_id', petId)
                .order('is_primary', { ascending: false });

            if (fetchError) throw fetchError;

            const mappedContacts: EmergencyContact[] = (data || []).map(contact => ({
                id: contact.id,
                contactType: (contact.contact_type || 'alternate') as EmergencyContactType,
                name: contact.name,
                relationship: contact.relationship,
                phone: contact.phone,
                email: contact.email,
                address: contact.address,
                isPrimary: contact.is_primary || false,
            }));

            setContacts(mappedContacts);
        } catch (err) {
            console.error('Error fetching emergency contacts:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch emergency contacts'));
        } finally {
            setLoading(false);
        }
    }, [petId]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const addContact = useCallback(async (data: EmergencyContactFormData) => {
        try {
            // If setting as primary, unset other primaries first? 
            // The DB triggers might handle this or logic needed here.
            // Usually valid to handle at application level.
            if (data.isPrimary) {
                // Unset others
                await supabase
                    .from('emergency_contacts')
                    .update({ is_primary: false })
                    .eq('pet_id', petId);
            }

            const { error: insertError } = await supabase
                .from('emergency_contacts')
                .insert({
                    pet_id: petId,
                    contact_type: data.contactType,
                    name: data.name,
                    relationship: data.relationship,
                    phone: data.phone,
                    email: data.email,
                    address: data.address,
                    is_primary: data.isPrimary,
                });

            if (insertError) throw insertError;

            await fetchContacts();
        } catch (err) {
            console.error('Error adding emergency contact:', err);
            throw err;
        }
    }, [petId, fetchContacts]);

    const updateContact = useCallback(async (
        id: string,
        data: Partial<EmergencyContactFormData>
    ) => {
        try {
            if (data.isPrimary) {
                await supabase
                    .from('emergency_contacts')
                    .update({ is_primary: false })
                    .eq('pet_id', petId)
                    .neq('id', id);
            }

            const updateData: any = {};
            if (data.contactType) updateData.contact_type = data.contactType;
            if (data.name) updateData.name = data.name;
            if (data.relationship !== undefined) updateData.relationship = data.relationship;
            if (data.phone) updateData.phone = data.phone;
            if (data.email !== undefined) updateData.email = data.email;
            if (data.address !== undefined) updateData.address = data.address;
            if (data.isPrimary !== undefined) updateData.is_primary = data.isPrimary;

            const { error: updateError } = await supabase
                .from('emergency_contacts')
                .update(updateData)
                .eq('id', id);

            if (updateError) throw updateError;

            await fetchContacts();
        } catch (err) {
            console.error('Error updating emergency contact:', err);
            throw err;
        }
    }, [petId, fetchContacts]);

    const deleteContact = useCallback(async (id: string) => {
        try {
            const { error: deleteError } = await supabase
                .from('emergency_contacts')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            await fetchContacts();
        } catch (err) {
            console.error('Error deleting emergency contact:', err);
            throw err;
        }
    }, [fetchContacts]);

    return {
        contacts,
        loading,
        error,
        addContact,
        updateContact,
        deleteContact,
    };
}
