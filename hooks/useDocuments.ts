import { useRef, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Document } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export function useDocuments(petId: string) {
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
    if (!user || !petId) return;
    if (isMountedRef.current) setLoading(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('pet_id', petId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (isMountedRef.current) setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [user, petId]);

  const uploadDocument = async (uri: string, type: Document['type'], fileName: string, metadata?: any, mimeType?: string) => {
    if (!user) return { error: { message: 'No user logged in' } };
    if (isMountedRef.current) setLoading(true);

    try {
      // 1. Read file
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });

      // 2. Upload to Storage
      // Path: userId/petId/timestamp-filename
      const timestamp = new Date().getTime();
      const cleanFileName = fileName.replace(/[^a-zA-Z0-9.]/g, '_');
      const filePath = `${user.id}/${petId}/${timestamp}-${cleanFileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pet-documents')
        .upload(filePath, decode(base64), {
          contentType: mimeType || 'application/octet-stream',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('pet-documents')
        .getPublicUrl(filePath);

      // 3. Insert into Table
      const { data, error: dbError } = await supabase
        .from('documents')
        .insert({
          pet_id: petId,
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
