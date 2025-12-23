'use server';

import { createSupabaseClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export const toggleBookmark = async (companionId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error('User not authenticated');

  const supabase = createSupabaseClient();

  try {
    // Check if bookmark already exists
    const { data: existingBookmark, error: checkError } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('companion_id', companionId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingBookmark) {
      // Remove bookmark
      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', userId)
        .eq('companion_id', companionId);

      if (deleteError) throw deleteError;
      
      // Revalidate pages that show bookmarks
      revalidatePath('/companions');
      revalidatePath('/my-journey');
      
      return { bookmarked: false };
    } else {
      // Add bookmark
      const { error: insertError } = await supabase
        .from('bookmarks')
        .insert({
          user_id: userId,
          companion_id: companionId,
          created_at: new Date().toISOString()
        });

      if (insertError) throw insertError;
      
      // Revalidate pages that show bookmarks
      revalidatePath('/companions');
      revalidatePath('/my-journey');
      
      return { bookmarked: true };
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    throw error;
  }
};

export const getUserBookmarks = async (userId: string) => {
  const supabase = createSupabaseClient();

  try {
    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select(`
        companion_id,
        companions (
          id,
          name,
          subject,
          topic,
          duration,
          author,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return bookmarks?.map(bookmark => bookmark.companions).filter(Boolean) || [];
  } catch (error) {
    console.error('Error fetching user bookmarks:', error);
    return [];
  }
};

export const isCompanionBookmarked = async (userId: string, companionId: string) => {
  const supabase = createSupabaseClient();

  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('companion_id', companionId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
};

export const getBookmarkedCompanionIds = async (userId: string) => {
  const supabase = createSupabaseClient();

  try {
    console.log('Fetching bookmarks for user:', userId);
    
    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select('companion_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log('Bookmarks fetched successfully:', bookmarks?.length || 0, 'bookmarks');
    return bookmarks?.map(bookmark => bookmark.companion_id) || [];
  } catch (error) {
    console.error('Error fetching bookmarked companion IDs:', error);
    return [];
  }
};