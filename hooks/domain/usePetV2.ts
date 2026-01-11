import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/hooks/api/useApiClient';
import type { Pet } from '@/types/v2/schema';

// Response types from Edge Functions
interface PetsResponse {
    pets: Pet[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

interface PetResponse {
    pet: Pet;
}

export function usePetsV2() {
    const client = useApiClient();

    return useQuery({
        queryKey: ['pets'],
        queryFn: async () => {
            // Assuming default pagination for now, can extend to accept params
            const response = await client.get<PetsResponse>('api-v1-pets');
            return response.pets;
        }
    });
}

export function usePetV2(id: string | null) {
    const client = useApiClient();

    return useQuery({
        queryKey: ['pet', id],
        queryFn: async () => {
            if (!id) return null;
            const response = await client.get<PetResponse>(`api-v1-pet-detail`, { id });
            return response.pet;
        },
        enabled: !!id
    });
}

export function useCreatePetV2() {
    const client = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newPet: Partial<Pet>) => {
            return client.post<PetResponse>('api-v1-pets', newPet);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pets'] });
        }
    });
}

export function useUpdatePetV2() {
    const client = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Pet> }) => {
            // Edge function expects body = { id, ...updates }
            return client.put<PetResponse>('api-v1-pet-detail', { id, ...updates });
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['pets'] });
            queryClient.invalidateQueries({ queryKey: ['pet', variables.id] });
        }
    });
}

export function useDeletePetV2() {
    const client = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return client.delete<{ message: string }>('api-v1-pet-detail', { id });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pets'] });
        }
    });
}
