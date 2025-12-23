import CompanionsCard from '@/components/CompanionsCard'
import CompanionsList from '@/components/CompanionsList'
import Cta from '@/components/Cta'
import { Button } from '@/components/ui/button'
import { recentSessions } from '@/constants'
import { getAllCompanions, getUserSessions } from '@/lib/actions/companions.actions'
import { getBookmarkedCompanionIds } from '@/lib/actions/bookmarks.actions'
import { getSubjectColor } from '@/lib/utils'
import { currentUser } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = async() => {
  const user = await currentUser();
  
  // Redirect to sign-in if user is not authenticated
  if (!user) {
    redirect('/sign-in');
  }
  
  const { has } = await auth();
  
  // Check if user has bookmark access (Core Learner or Pro Companion)
  const hasBookmarkAccess = has({plan:'core'}) || has({plan:'pro'}) || false;
  
  const companions = await getAllCompanions({limit:3});
  const recentSessionsCompanion = await getUserSessions(user.id, 10);
  
  // Get user's bookmarked companions if they have access
  let bookmarkedIds: string[] = [];
  if (hasBookmarkAccess) {
    try {
      bookmarkedIds = await getBookmarkedCompanionIds(user.id);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  }
  
  // Sort companions: bookmarked first, then by creation date
  const sortedCompanions = companions.sort((a, b) => {
    const aBookmarked = bookmarkedIds.includes(a.id);
    const bBookmarked = bookmarkedIds.includes(b.id);
    
    if (aBookmarked && !bBookmarked) return -1;
    if (!aBookmarked && bBookmarked) return 1;
    
    // If both are bookmarked or both are not, maintain original order
    return 0;
  });
  
  return (
    <main>
      <h1 className='text-2xl underline'>My Companions</h1>
      
      {companions.length > 0 ? (
        <section className='home-section'>
          {sortedCompanions.map((companion)=>(
            <CompanionsCard
              key={companion.id}
              {...companion}
              color={getSubjectColor(companion.subject)}
              isBookmarked={bookmarkedIds.includes(companion.id)}
              hasBookmarkAccess={hasBookmarkAccess}
            />
          ))}
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold mb-2">No Companions Yet</h2>
          <p className="text-gray-600 mb-6">Create your first AI learning companion to get started!</p>
          <a 
            href="/companions/new" 
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Create Your First Companion
          </a>
        </section>
      )}

      {recentSessionsCompanion.length > 0 && (
        <section className='home-section'>
          <CompanionsList
            title = "Recently completed sessions"
            companions = {recentSessionsCompanion}
            classNames = "w-2/3 max-lg:w-full"
          />
          <Cta />
        </section>
      )}
    </main>
  )
}

export default Page