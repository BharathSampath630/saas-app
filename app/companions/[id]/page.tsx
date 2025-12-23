import { getCompanion } from "@/lib/actions/companions.actions";
import { isCompanionBookmarked } from "@/lib/actions/bookmarks.actions";
import { getSubjectColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import Image from "next/image";
import CompanionComponent from "@/components/CompanionComponent";
import DeleteCompanionButton from "@/components/DeleteCompanionButton";
import BookmarkButton from "@/components/BookmarkButton";
import QuizSection from "@/components/QuizSection";

interface CompanionSessionPageProps{
  params:Promise<{id:string}>;
}


const CompanionSession = async({params}:CompanionSessionPageProps) => {

  const {id} = await params;
  const companion = await getCompanion(id);
  const user = await currentUser();
  const {has} = await auth();
  const{name,subject,title,topic,duration,author} = companion;
  if(!user) redirect('/sign-in');
  if(!name) redirect('/companions');
  
  // Check if current user is the author of this companion
  console.log('User ID:', user.id, 'Author:', author, 'Match:', user.id === author);
  const isOwner = user.id === author;
  
  // Check if user has pro or core learner subscription (quiz access)
  const hasQuizAccess = has({plan:'pro'}) || has({plan:'core'}) || false;
  
  // Check if user has bookmark access
  const hasBookmarkAccess = has({plan:'core'}) || has({plan:'pro'}) || false;
  
  // Check if companion is bookmarked
  let isBookmarked = false;
  if (hasBookmarkAccess) {
    try {
      isBookmarked = await isCompanionBookmarked(user.id, id);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  }
  return (
    <main>
      <article className="flex rounded-border justify-between p-6 max-md:flex-col">
        <div className="flex items-center gap-2">
          <div className="size-[72px] flex items-center
            justify-center rounded-lg max-md:hidden" 
            style = {{backgroundColor:getSubjectColor(subject)}}>
              <Image src = {`/icons/${subject}.svg`} 
              alt = {subject} width= {35} height = {35}/>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="font-bold text-2xl">
                {name}
              </p>
              <div className="subject-badge max-sm:hidden">
                {subject}
              </div>
            </div>
            <p className="text-lg">{topic}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl max-md:hidden">
              {duration} minutes
            </div>
            <BookmarkButton 
              companionId={id}
              isBookmarked={isBookmarked}
              hasBookmarkAccess={hasBookmarkAccess}
            />
          </div>
          {isOwner && (
            <DeleteCompanionButton 
              companionId={id} 
              companionName={name} 
            />
          )}
        </div>
      </article>

      <QuizSection 
        subject={subject}
        topic={topic}
        isProUser={hasQuizAccess}
      />
      
      <CompanionComponent
        {...companion}
        companionId={id}
        userName={user.firstName}
        userImage={user.imageUrl!}
      />
    </main>
  )
}

export default CompanionSession