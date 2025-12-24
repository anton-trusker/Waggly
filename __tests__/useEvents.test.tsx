import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { jest, test, expect } from '@jest/globals';
import { useEvents } from '@/hooks/useEvents';

jest.mock('@/lib/supabase', () => {
  const makeChain = () => {
    const chain: any = {
      select: () => chain,
      in: () => ({
        // Thenable so that awaiting after `.in(...)` resolves to a result
        then: (resolve: any) => resolve({ data: [], error: null }),
        eq: () => ({ data: [], error: null }),
        order: () => ({ data: [], error: null }),
      }),
      eq: () => ({ data: [], error: null }),
      order: () => ({ data: [], error: null }),
    };
    return chain;
  };

  return {
    supabase: {
      from: (_table: string) => makeChain(),
      storage: {
        from: () => ({
          upload: async () => ({ data: {}, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: 'https://example.com' } }),
        }),
      },
    },
  };
});

jest.mock('@/hooks/usePets', () => ({
  usePets: () => ({
    pets: [{ id: 'p1', name: 'Buddy' }],
    loading: false,
  }),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'u1' } }),
}));

function TestComponent() {
  const { events, loading } = useEvents();
  return <Text>{loading ? 'loading' : `events:${events.length}`}</Text>;
}

test('useEvents returns empty events when no data', async () => {
  const { getByText } = render(<TestComponent />);
  await waitFor(() => getByText(/events:0/));
});
