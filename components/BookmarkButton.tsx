'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { toggleBookmark } from '@/lib/actions/bookmarks.actions';

interface BookmarkButtonProps {
  companionId: string;
  isBookmarked: boolean;
  hasBookmarkAccess: boolean;
}

const BookmarkButton = ({ companionId, isBookmarked, hasBookmarkAccess }: BookmarkButtonProps) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isPending, startTransition] = useTransition();

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hasBookmarkAccess) {
      // Redirect to subscription page or show upgrade modal
      window.location.href = '/subscription';
      return;
    }

    startTransition(async () => {
      try {
        const result = await toggleBookmark(companionId);
        setBookmarked(result.bookmarked);
      } catch (error) {
        console.error('Error toggling bookmark:', error);
      }
    });
  };

  if (!hasBookmarkAccess) {
    return (
      <button 
        className="companion-bookmark opacity-50 cursor-pointer hover:opacity-75 transition-opacity"
        onClick={handleBookmarkToggle}
        title="Upgrade to Core Learner or Pro Companion to bookmark companions"
      >
        <Image 
          src="/icons/bookmark.svg" 
          alt="bookmark"
          width={12.5} 
          height={15} 
        />
      </button>
    );
  }

  return (
    <button 
      className={`companion-bookmark transition-all duration-200 ${
        bookmarked 
          ? 'bg-yellow-500 hover:bg-yellow-600' 
          : 'bg-black hover:bg-gray-800'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={handleBookmarkToggle}
      disabled={isPending}
      title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <Image 
        src="/icons/bookmark.svg" 
        alt="bookmark"
        width={12.5} 
        height={15}
        className={bookmarked ? 'filter brightness-0' : ''}
      />
    </button>
  );
};

export default BookmarkButton;