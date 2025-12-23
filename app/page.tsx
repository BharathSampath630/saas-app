import CompanionsCard from '@/components/CompanionsCard'
import CompanionsList from '@/components/CompanionsList'
import Cta from '@/components/Cta'
import { Button } from '@/components/ui/button'
import { recentSessions } from '@/constants'
import { getAllCompanions, getRecentSession } from '@/lib/actions/companions.actions'
import { getBookmarkedCompanionIds } from '@/lib/actions/bookmarks.actions'
import { getSubjectColor } from '@/lib/utils'
import { currentUser } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const Page = async() => {
  const user = await currentUser();
  const { has } = await auth();
  
  // Check if user has bookmark access (Core Learner or Pro Companion)
  const hasBookmarkAccess = has({plan:'core'}) || has({plan:'pro'}) || false;
  
  const companions = await getAllCompanions({limit:3});
  const recentSessionsCompanion = await getRecentSession(10);
  
  // Get user's bookmarked companions if they have access and are logged in
  let bookmarkedIds: string[] = [];
  if (user && hasBookmarkAccess) {
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
      <h1 className='text-2xl underline'>Popular Companions</h1>
      
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

      <section className='home-section'>
        <CompanionsList
          title = "Recently completed sessions"
          companions = {recentSessionsCompanion}
          classNames = "w-2/3 max-lg:w-full"
        />
        <Cta />
      </section>
    </main>
  )
}

export default Page