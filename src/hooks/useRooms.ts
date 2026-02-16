import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Room {
  id: string;
  name: string;
  type: 'deluxe' | 'executive' | 'presidential';
  price: number;
  image_url: string | null;
  description: string | null;
  features: string[] | null;
  capacity: number;
  size: number;
  available: boolean;
}

export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) throw error;
      return data as Room[];
    },
  });
}

export function useAvailableRooms() {
  return useQuery({
    queryKey: ['rooms', 'available'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('available', true)
        .order('price', { ascending: true });
      
      if (error) throw error;
      return data as Room[];
    },
  });
}

export function useRoomsByType(type: 'deluxe' | 'executive' | 'presidential') {
  return useQuery({
    queryKey: ['rooms', 'type', type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('type', type)
        .order('price', { ascending: true });
      
      if (error) throw error;
      return data as Room[];
    },
  });
}
