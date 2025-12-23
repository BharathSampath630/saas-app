import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getUserCompanions, getUserSessions, getUserStreak } from "@/lib/actions/companions.actions";
import { getProAnalytics } from "@/lib/actions/analytics.actions";
import { currentUser } from "@clerk/nextjs/server"
import { auth } from "@clerk/nextjs/server"
import {redirect} from "next/navigation"
import Image from "next/image";
import CompanionsList from "@/components/CompanionsList";
import StreakCard from "@/components/StreakCard";
import ProDashboard from "@/components/ProDashboard";
import Link from "next/link";

const Profile = async() => {
  const user = await currentUser();
  if(!user) redirect('/sign-in');

  const { has } = await auth();
  const isProUser = has({plan:'pro'}) || false;

  const companions = await getUserCompanions(user.id);
  const sessionHistory = await getUserSessions(user.id);
  const userStreak = await getUserStreak(user.id);

  // Get Pro analytics if user is Pro Companion
  let proAnalytics = null;
  if (isProUser) {
    proAnalytics = await getProAnalytics(user.id);
  }



  return (
    <main className="min-lg:w-3/4">
      {/* My Learning Journey - Always at top */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          📊 My Learning Journey
          {isProUser && (
            <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              Pro Companion
            </span>
          )}
        </h2>
        
        <section className="flex justify-between gap-4 max-sm:flex-col items-center">
        <div className="flex gap-4 items-center">
          <Image src = {user.imageUrl} alt = {user.firstName!} 
            width={110} height={110}
            />
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
              <p className="text-sm text-muted-foreground">{user.emailAddresses[0].emailAddress}</p>
            </div>
        </div>

        <div className="flex gap-4 max-sm:flex-col max-sm:w-full">
          <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Image src = "/icons/check.svg" alt = "checkmark" width = {22} height = {22}/>
              <p className="text-2xl font-bold">{sessionHistory.length}</p>
            </div>
            <div>Lessons Completed</div>
          </div>

          <div className="border border-black rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Image src = "/icons/cap.svg" alt = "checkmark" width = {22} height = {22}/>
              <p className="text-2xl font-bold">{companions.length}</p>
            </div>
            <div>Companions Created</div>
          </div>
        </div>
      </section>

      {/* Streak Section */}
      <section className="my-6">
        <StreakCard 
          currentStreak={userStreak.current_streak}
          longestStreak={userStreak.longest_streak}
          lastActivityDate={userStreak.last_activity_date}
        />
      </section>
      
      <Accordion type="multiple">
          <AccordionItem value="recent">
            <AccordionTrigger className="text-2xl font-bold">Recent Sessions</AccordionTrigger>
            <AccordionContent>
              <CompanionsList title = "Recent Sessions" companions = {sessionHistory}/>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="companions">
            <AccordionTrigger className="text-2xl font-bold">
              My Companions {`(${companions.length})`}
            </AccordionTrigger>

            <AccordionContent>
              <CompanionsList title = "My Companions" companions = {companions}/>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Pro Dashboard for Pro Companion users */}
      {isProUser && proAnalytics && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <ProDashboard userId={user.id} userStats={proAnalytics} />
        </div>
      )}

      {/* Upgrade Banner for Free/Core Users */}
      {!isProUser && (
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg text-white">
          <div className="flex items-center justify-between max-md:flex-col max-md:gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">🚀 Unlock Pro Analytics Dashboard</h2>
              <p className="text-purple-100">
                Get advanced insights, AI-powered recommendations, and detailed performance analytics
              </p>
              <div className="flex gap-4 mt-3 text-sm">
                <span className="flex items-center gap-1">
                  ✨ Learning velocity tracking
                </span>
                <span className="flex items-center gap-1">
                  🧠 AI insights & predictions
                </span>
                <span className="flex items-center gap-1">
                  📊 Subject mastery analysis
                </span>
              </div>
            </div>
            <Link href="/subscription">
              <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Upgrade to Pro Companion
              </button>
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}

export default Profile