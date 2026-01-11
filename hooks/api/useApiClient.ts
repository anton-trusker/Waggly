import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';

const EDGE_FUNCTION_URL = process.env.EXPO_PUBLIC_SUPABASE_URL + '/functions/v1';

export class ApiError extends Error {
    constructor(public status: number, public message: string, public data?: any) {
        super(message);
        this.name = 'ApiError';
    }
}

export function useApiClient() {
    const { session } = useAuth(); // Assuming AuthContext exposes session

    const client = useMemo(() => {
        return {
            get: async <T>(endpoint: string, params?: Record<string, string>) => {
                const url = new URL(`${EDGE_FUNCTION_URL}/${endpoint}`);
                if (params) {
                    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
                }

                return request<T>(url.toString(), 'GET', session?.access_token);
            },

            post: async <T>(endpoint: string, body: any) => {
                return request<T>(`${EDGE_FUNCTION_URL}/${endpoint}`, 'POST', session?.access_token, body);
            },

            put: async <T>(endpoint: string, body: any) => {
                return request<T>(`${EDGE_FUNCTION_URL}/${endpoint}`, 'PUT', session?.access_token, body);
            },

            delete: async <T>(endpoint: string, body?: any) => {
                return request<T>(`${EDGE_FUNCTION_URL}/${endpoint}`, 'DELETE', session?.access_token, body);
            }
        };
    }, [session?.access_token]);

    return client;
}

async function request<T>(url: string, method: string, token?: string, body?: any): Promise<T> {
    if (!token) {
        throw new ApiError(401, 'Not authenticated');
    }

    const headers: HeadersInit = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const options: RequestInit = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    // Try to parse JSON response
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
    } else {
        responseData = await response.text();
    }

    if (!response.ok) {
        throw new ApiError(
            response.status,
            responseData?.error || 'Unknown API error',
            responseData
        );
    }

    return responseData as T;
}
