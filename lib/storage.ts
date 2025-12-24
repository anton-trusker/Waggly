import { supabase } from '@/lib/supabase';
import { Platform } from 'react-native';
import { decode } from 'base64-arraybuffer';

async function uriToBlob(uri: string): Promise<Blob> {
  const res = await fetch(uri, { cache: 'no-store' });
  return await res.blob();
}

function getAnonKey(): string {
  return (
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.EXPO_PUBLIC_ANON_KEY ||
    ''
  );
}

function relativePathFromPublicUrl(bucket: string, publicUrl: string): string | null {
  try {
    const u = new URL(publicUrl);
    const idx = u.pathname.indexOf(`/storage/v1/object/public/${bucket}/`);
    if (idx === -1) return null;
    return u.pathname.substring(idx + `/storage/v1/object/public/${bucket}/`.length);
  } catch {
    return null;
  }
}

export async function deleteImage(bucket: string, publicUrl?: string | null) {
  if (!publicUrl) return;
  const rel = relativePathFromPublicUrl(bucket, publicUrl);
  if (!rel) return;
  await supabase.storage.from(bucket).remove([rel]);
}

/**
 * Generic image upload function.
 * @param bucket The storage bucket name (e.g., 'pet-photos', 'user-photos').
 * @param path The storage path (e.g., 'userId/pets/petId/timestamp.ext').
 * @param uri The local file URI.
 * @param previousUrl Optional URL of a previous image to delete.
 */
export async function uploadImage(
  bucket: string,
  path: string,
  uri: string,
  previousUrl?: string | null
): Promise<string> {
  const ext = uri.toLowerCase().endsWith('.png') ? 'png' : 'jpg';
  const filename = `${Date.now()}.${ext}`;
  const fullPath = path.endsWith('/') ? `${path}${filename}` : `${path}/${filename}`;
  
  const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
  const baseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
  const url = `${baseUrl}/storage/v1/object/${bucket}/${fullPath}`;
  const anon = getAnonKey();

  if (Platform.OS === 'web') {
    const blob = await uriToBlob(uri);
    const file = new File([blob], filename, { type: contentType });
    const { error } = await supabase.storage.from(bucket).upload(fullPath, file, {
      contentType,
      upsert: true,
    });
    if (error) throw error;
  } else {
    // Native: Use FileReader to read as DataURL (base64) then convert to ArrayBuffer
    try {
      const blob = await uriToBlob(uri);
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          // result is "data:image/jpeg;base64,....."
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const base64 = await base64Promise;
      const arrayBuffer = decode(base64);

      const { error } = await supabase.storage.from(bucket).upload(fullPath, arrayBuffer, {
        contentType,
        upsert: true,
      });
      if (error) throw error;
    } catch (e) {
      console.error('Upload error:', e);
      throw e;
    }
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fullPath);
  
  if (previousUrl) {
    // Best-effort delete of old image
    deleteImage(bucket, previousUrl).catch((e) => console.warn('Failed to delete old image:', e));
  }

  return data.publicUrl;
}

// Helper for Pet Photos
export async function uploadPetPhoto(userId: string, petId: string, uri: string, previousUrl?: string | null) {
  return uploadImage('pet-photos', `${userId}/pets/${petId}`, uri, previousUrl);
}

// Helper for User Photos
export async function uploadUserPhoto(userId: string, uri: string, previousUrl?: string | null) {
  return uploadImage('user-photos', `${userId}/profile`, uri, previousUrl);
}
