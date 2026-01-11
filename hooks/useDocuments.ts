import { useRef, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Document } from '@/types/v2/schema';
import { useAuth } from '@/contexts/AuthContext';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { Platform } from 'react-native';

let usePostHog: any = () => ({ capture: () => { } });

if (Platform.OS !== 'web') {
  try {
    const PostHogRN = require('posthog-react-native');
    usePostHog = PostHogRN.usePostHog;
  } catch (e) {
    console.warn('PostHog not available');
  }
}

export function useDocuments(petId?: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const isMountedRef = useRef(true);
  const posthog = usePostHog();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchDocuments = useCallback(async () => {
    if (!user) return;
    if (isMountedRef.current) setLoading(true);
    try {
      let query = supabase
        .from('documents')
        .select('*') // Simplified: fetch raw data only to avoid FK join errors
        .order('created_at', { ascending: false });

      if (petId) {
        query = query.eq('pet_id', petId);
      }

      console.log(`[useDocuments] Fetching docs for user ${user.id}. PetId filter: ${petId || 'None'}`);

      const { data, error } = await query;

      if (error) {
        console.error('[useDocuments] Fetch error:', error);
        throw error;
      }

      console.log(`[useDocuments] Fetched ${data?.length} documents.`);

      // Data already has correct V2 schema: name, file_path, file_type, file_size
      const formattedData = (data || []).map((doc: any) => ({
        ...doc,
        // V2 already has 'name', add convenience fields
        url: doc.file_path, // For backward compatibility
        uploadedAt: new Date(doc.created_at).toLocaleDateString()
      }));

      if (isMountedRef.current) setDocuments(formattedData);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [user, petId]);

  const uploadDocument = async (uri: string, type: Document['type'], fileName: string, metadata?: any, mimeType?: string, targetPetId?: string) => {
    if (!user) return { error: { message: 'No user logged in' } };

    // Use targetPetId if provided, otherwise fail if hook was initialized without petId
    const finalPetId = targetPetId || petId;
    if (!finalPetId) return { error: { message: 'Pet ID is required for upload' } };

    if (isMountedRef.current) setLoading(true);

    try {
      const timestamp = new Date().getTime();
      const cleanFileName = fileName.replace(/[^a-zA-Z0-9.]/g, '_');
      const filePath = `${user.id}/${finalPetId}/${timestamp}-${cleanFileName}`;

      let uploadBody;

      if (Platform.OS === 'web') {
        // On web, fetch the blob from the URI (which is usually a blob: URL)
        const response = await fetch(uri);
        uploadBody = await response.blob();
      } else {
        // On mobile, read as base64
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: 'base64',
        });
        uploadBody = decode(base64);
      }

      // 2. Upload to Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pet-documents')
        .upload(filePath, uploadBody, {
          contentType: mimeType || 'application/octet-stream',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('pet-documents')
        .getPublicUrl(filePath);

      // 3. Insert into Table (V2 schema)
      const { data, error: dbError } = await (supabase
        .from('documents') as any)
        .insert({
          pet_id: finalPetId,
          category: type, // V2 uses 'category' not 'type'
          name: fileName,
          file_path: publicUrl,
          file_type: mimeType || null,
          file_size: metadata?.size || metadata?.size_bytes || null,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      posthog.capture('document_uploaded', {
        pet_id: finalPetId,
        document_type: type,
        file_name: fileName,
      });

      // OPTIMISTIC UPDATE: Immediately add to local state
      const formattedDoc = {
        ...data,
        url: data.file_path, // V2 has file_path
        uploadedAt: new Date(data.created_at).toLocaleDateString()
      };
      if (isMountedRef.current) {
        setDocuments(prev => [formattedDoc, ...prev]);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error uploading document:', error);
      return { error };
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const deleteDocument = async (documentId: string, fileUrl: string) => {
    if (isMountedRef.current) setLoading(true);
    try {
      console.log(`[useDocuments] Deleting doc ${documentId}. User: ${user?.id}`);

      // 1. Delete from Table
      const response = await supabase
        .from('documents')
        .delete({ count: 'exact' })
        .eq('id', documentId);

      const { error: dbError, count } = response;
      console.log('[useDocuments] Delete response:', response);

      if (dbError) throw dbError;

      if (count === 0 || count === null) {
        console.warn(`[useDocuments] Count is ${count}. Check RLS or ID.`);
        // We might want to throw an error here to notify the UI, or just return custom error
        return { error: { message: 'Document could not be deleted. Access denied or not found.' } };
      }

      posthog.capture('document_deleted', {
        document_id: documentId,
      });

      // OPTIMISTIC UPDATE: Remove from local state immediately
      if (isMountedRef.current) {
        setDocuments(prev => prev.filter(d => d.id !== documentId));
      }

      // 2. Delete from Storage (extract path from URL)
      // URL format: .../storage/v1/object/public/pet-documents/path/to/file
      const path = fileUrl.split('/pet-documents/')[1];
      if (path) {
        const { error: storageError } = await supabase.storage
          .from('pet-documents')
          .remove([path]);

        if (storageError) console.error('Error deleting file from storage:', storageError);
      }

      return { error: null };
    } catch (error) {
      console.error('Error deleting document:', error);
      return { error };
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  return {
    documents,
    loading,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
  };
}
