'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
export const createCompanion = async(formData:CreateCompanion) =>{
    const {userId:author} = await auth();
    const supabase = createSupabaseClient();

    const {data,error} = await supabase.from('companions')
        .insert({...formData,author})
        .select();
    if(error||!data) throw new Error(error?.message ||"Failed to create a companion");

    return data[0];
}

export const getAllCompanions = async({limit = 10,page = 1,subject,topic}:GetAllCompanions) =>{
    const {userId} = await auth();
    if (!userId) throw new Error('User not authenticated');
    
    const supabase = createSupabaseClient();

    let query = supabase.from('companions').select().eq('author', userId);
    if(subject && topic){
        query = query.ilike('subject',`%${subject}%`).or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    } else if(subject){
        query = query.ilike('subject',`%${subject}%`);
    } else if(topic){
        query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    }

    query = query.range((page - 1) * limit, page * limit - 1);

    const {data:comnpanions,error} = await query;

    if(error) throw new Error(error.message);

    return comnpanions;
}

export const getCompanion = async(id:string) =>{
    const supabase = createSupabaseClient();

    const {data,error} = await supabase.from('companions').select().eq('id',id);
    if(error) return console.log(error);
    console.log('Companion data:', data[0]);
    return data[0];
}


export const addToSessionHistory = async(companionId:string) =>{
    const {userId} = await auth();
    const supabase = createSupabaseClient();

    const {data,error} = await supabase.from('session_history').insert({user_id:userId,companion_id:companionId});

    if(error) throw new Error(error.message);

    // Update user streak after completing a session
    await updateUserStreak(userId!);

    return data
}

export const getUserStreak = async(userId:string) =>{
    const supabase = createSupabaseClient();
    
    const {data,error} = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id',userId)
        .single();

    if(error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw new Error(error.message);
    }

    if(!data) {
        // Create initial streak record
        const {data:newStreak,error:createError} = await supabase
            .from('user_streaks')
            .insert({
                user_id: userId,
                current_streak: 0,
                longest_streak: 0,
                last_activity_date: null
            })
            .select()
            .single();

        if(createError) throw new Error(createError.message);
        return newStreak;
    }

    return data;
}

export const updateUserStreak = async(userId:string) =>{
    const supabase = createSupabaseClient();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const streak = await getUserStreak(userId);
    
    // If user already completed a lesson today, don't update streak
    if(streak.last_activity_date === today) {
        return streak;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newCurrentStreak = 1;
    
    // If last activity was yesterday, increment streak
    if(streak.last_activity_date === yesterdayStr) {
        newCurrentStreak = streak.current_streak + 1;
    }
    // If last activity was today, keep current streak (shouldn't happen due to check above)
    else if(streak.last_activity_date === today) {
        newCurrentStreak = streak.current_streak;
    }
    // If last activity was more than 1 day ago, reset streak to 1

    const newLongestStreak = Math.max(streak.longest_streak, newCurrentStreak);

    const {data,error} = await supabase
        .from('user_streaks')
        .update({
            current_streak: newCurrentStreak,
            longest_streak: newLongestStreak,
            last_activity_date: today
        })
        .eq('user_id',userId)
        .select()
        .single();

    if(error) throw new Error(error.message);
    
    return data;
}

export const getRecentSession = async(limit = 10) =>{
    const supabase = createSupabaseClient();
    const {data,error} = await supabase.from('session_history').select(`companions:companion_id (*)`)
    .order('created_at',{ascending:false}).limit(limit);

    if(error) throw new Error(error.message);

    return data.map(({companions}) => companions);
}

export const getUserSessions = async(userId:string,limit = 10) =>{
    const supabase = createSupabaseClient();
    const {data,error} = await supabase.from('session_history').select(`companions:companion_id (*)`)
    .eq('user_id',userId)
    .order('created_at',{ascending:false}).limit(limit);

    if(error) throw new Error(error.message);

    return data.map(({companions}) => companions);
}

export const getUserCompanions = async(userId:string) =>{
    const supabase = createSupabaseClient();
    console.log('Getting companions for user ID:', userId);
    const {data,error} = await supabase.from('companions').select()
    .eq('author',userId)
    .order('created_at',{ascending:false});

    if(error) throw new Error(error.message);
    
    console.log('Found companions:', data?.length || 0);
    return data;
}

export const deleteCompanion = async(id:string) =>{
    const {userId} = await auth();
    const supabase = createSupabaseClient();

    // First check if the user owns this companion
    const {data:companion,error:fetchError} = await supabase
        .from('companions')
        .select('author')
        .eq('id',id)
        .single();

    if(fetchError) throw new Error(fetchError.message);
    if(companion.author !== userId) throw new Error("Unauthorized to delete this companion");

    // Delete the companion
    const {error} = await supabase
        .from('companions')
        .delete()
        .eq('id',id);

    if(error) throw new Error(error.message);

    return {success: true};
}

export const newCompanionPermissions = async() =>{
    const {userId,has} = await auth();
    const supabase = createSupabaseClient();
    let limit = 0;
    if(has({plan:'pro'})){
        return true;
    } else if(has({feature:"3_companion_limit"})){
        limit = 3;
    } else if(has({feature:"10_companion_limit"})){
        limit = 10;
    }

    const {data,error} =  await supabase.from('companions').select('id',{count:'exact'}).eq('author',userId);

    if(error) throw new Error(error.message);   

    const companionCount = data.length;

    if(companionCount >= limit){
        return false;
    } else{
        return true;
    }
}