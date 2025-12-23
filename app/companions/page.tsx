import { getAllCompanions } from "@/lib/actions/companions.actions";
import { getBookmarkedCompanionIds } from "@/lib/actions/bookmarks.actions";
import CompanionsCard from "@/components/CompanionsCard";
import { getSubjectColor } from "@/lib/utils";
import { Search } from "lucide-react";
import SubjectFilter from "@/components/SubjectFilter";
import SearchInput from "@/components/SearchInput";
import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
const CompanionsLibrary = async ({searchParams}:SearchParams) => {
  const filters = await searchParams;
  const subject = filters.subject ? filters.subject : '';
  const topic = filters.topic ? filters.topic : '';

  const user = await currentUser();
  const { has } = await auth();
  
  // Check if user has bookmark access (Core Learner or Pro Companion)
  const hasBookmarkAccess = has({plan:'core'}) || has({plan:'pro'}) || false;
  
  const companions = await getAllCompanions({subject,topic});
  
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
    
    // If both are bookmarked or both are not, sort by creation date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <main>
      <section className="flex justify-between gap-4 max-sm:flex-col">
        <h1>Companion Library</h1>
        <div className="flex gap-4">
          <SearchInput />
          <SubjectFilter />
        </div>
      </section>
      
      {/* Show upgrade banner for free users */}
      {!hasBookmarkAccess && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
          <div className="flex items-center justify-between max-md:flex-col max-md:gap-3">
            <div>
              <h3 className="font-bold">📌 Bookmark Your Favorite Companions</h3>
              <p className="text-sm text-blue-100">
                Save companions for quick access - available for Core Learner and Pro Companion users
              </p>
            </div>
            <a href="/subscription" className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Upgrade Now
            </a>
          </div>
        </div>
      )}
      
      {/* Bookmarked Companions Section */}
      {hasBookmarkAccess && bookmarkedIds.length > 0 && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              📌 Bookmarked Companions ({bookmarkedIds.length})
            </h2>
            <section className="companions-grid">
              {sortedCompanions
                .filter(companion => bookmarkedIds.includes(companion.id))
                .map((companion) => (
                  <CompanionsCard 
                    key={companion.id} 
                    {...companion} 
                    color={getSubjectColor(companion.subject)}
                    isBookmarked={true}
                    hasBookmarkAccess={hasBookmarkAccess}
                  />
                ))}
            </section>
          </div>
          
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-4">All Companions</h2>
          </div>
        </>
      )}
      
      <section className="companions-grid">
        {sortedCompanions
          .filter(companion => !bookmarkedIds.includes(companion.id))
          .map((companion) => (
            <CompanionsCard 
              key={companion.id} 
              {...companion} 
              color={getSubjectColor(companion.subject)}
              isBookmarked={false}
              hasBookmarkAccess={hasBookmarkAccess}
            />
          ))}
      </section>
    </main>
  )
}

export default CompanionsLibrary