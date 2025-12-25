import { useRef, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Document } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { Platform } from 'react-native';

export function useDocuments(petId?: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const isMountedRef = useRef(true);

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
        .select('*, pets:pet_id(name)') // Fetch pet name via foreign key
        .order('created_at', { ascending: false });

      if (petId) {
        query = query.eq('pet_id', petId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase fetch error:', error);
        throw error;
      }

      console.log('Fetched documents:', data);

      // Transform data to include petName flatly if needed, or just keep as is
      // TypeScript might need assertion or manual type fix since 'pets' is a joined property
      const formattedData = (data || []).map((doc: any) => ({
        ...doc,
        name: doc.file_name, // Map file_name to name for compatibility
        url: doc.file_url, // Map file_url to url for compatibility
        petName: doc.pets?.name || 'Unknown Pet',
        uploadedAt: new Date(doc.created_at).toLocaleDateString() // Simple formatting
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

      // 3. Insert into Table
      const { data, error: dbError } = await (supabase
        .from('documents') as any)
        .insert({
          pet_id: finalPetId,
          type,
          file_url: publicUrl,
          file_name: fileName,
          metadata: metadata || {},
          mime_type: mimeType || null,
          size_bytes: metadata?.size_bytes || null,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      await fetchDocuments();
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
      // 1. Delete from Table
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      // 2. Delete from Storage (extract path from URL)
      // URL format: .../storage/v1/object/public/pet-documents/path/to/file
      const path = fileUrl.split('/pet-documents/')[1];
      if (path) {
        const { error: storageError } = await supabase.storage
          .from('pet-documents')
          .remove([path]);

        if (storageError) console.error('Error deleting file from storage:', storageError);
      }

      await fetchDocuments();
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
