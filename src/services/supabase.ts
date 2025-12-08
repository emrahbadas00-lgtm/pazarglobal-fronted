import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || 'https://snovwbffwvmkgjulrtsm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNub3Z3YmZmd3Zta2dqdWxydHNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMzU3NDQsImV4cCI6MjA3ODgxMTc0NH0.g6j0c4eYwIoXWZccCk9smGHQHBrT3F_KOx5TahrQNrI';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Listing type matching database schema
export interface DBListing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  images: string[];
  image_url?: string;
  tags: string[];
  status: 'active' | 'sold' | 'expired';
  views: number;
  favorites: number;
  created_at: string;
  updated_at: string;
  is_premium?: boolean;
  premium_expires_at?: string;
}

// Fetch all listings
export async function fetchListings() {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase fetch error:', error);
    throw error;
  }

  return data as DBListing[];
}

// Fetch listings with filters
export async function fetchListingsWithFilters(filters: {
  categories?: string[];
  priceRange?: [number, number];
  location?: string;
  condition?: string[];
  isPremium?: boolean;
  dateRange?: string;
}) {
  let query = supabase
    .from('listings')
    .select('*')
    .eq('status', 'active');

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    query = query.in('category', filters.categories);
  }

  // Price range filter
  if (filters.priceRange) {
    query = query
      .gte('price', filters.priceRange[0])
      .lte('price', filters.priceRange[1]);
  }

  // Location filter
  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }

  // Condition filter
  if (filters.condition && filters.condition.length > 0) {
    query = query.in('condition', filters.condition);
  }

  // Premium filter
  if (filters.isPremium) {
    query = query.eq('is_premium', true);
  }

  // Date range filter
  if (filters.dateRange && filters.dateRange !== 'all') {
    const now = new Date();
    const dateThreshold = new Date();

    switch (filters.dateRange) {
      case 'today':
        dateThreshold.setHours(0, 0, 0, 0);
        break;
      case 'week':
        dateThreshold.setDate(now.getDate() - 7);
        break;
      case 'month':
        dateThreshold.setDate(now.getDate() - 30);
        break;
    }

    query = query.gte('created_at', dateThreshold.toISOString());
  }

  // Order by created_at descending (newest first by default)
  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Supabase filtered fetch error:', error);
    throw error;
  }

  return data as DBListing[];
}

// Fetch single listing by ID
export async function fetchListingById(id: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Supabase fetch by ID error:', error);
    throw error;
  }

  return data as DBListing;
}

// Increment view count
export async function incrementViewCount(id: string) {
  const { error } = await supabase.rpc('increment_view_count', {
    listing_id: id,
  });

  if (error) {
    console.error('Increment view error:', error);
  }
}

// Toggle favorite
export async function toggleFavorite(listingId: string) {
  // This would need a favorites table in Supabase
  // For now, just increment/decrement the favorites count
  const { data: listing } = await supabase
    .from('listings')
    .select('favorites')
    .eq('id', listingId)
    .single();

  if (listing) {
    const { error } = await supabase
      .from('listings')
      .update({ favorites: listing.favorites + 1 })
      .eq('id', listingId);

    if (error) {
      console.error('Toggle favorite error:', error);
    }
  }
}

// Search listings (full-text search)
export async function searchListings(query: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase search error:', error);
    throw error;
  }

  return data as DBListing[];
}
