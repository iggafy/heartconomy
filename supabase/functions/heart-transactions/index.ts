
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { action, ...data } = await req.json()

    switch (action) {
      case 'create_post':
        return await handleCreatePost(supabaseClient, user.id, data)
      case 'like_post':
        return await handleLikePost(supabaseClient, user.id, data)
      case 'unlike_post':
        return await handleUnlikePost(supabaseClient, user.id, data)
      case 'comment_post':
        return await handleCommentPost(supabaseClient, user.id, data)
      case 'revive_user':
        return await handleReviveUser(supabaseClient, user.id, data)
      case 'burn_hearts':
        return await handleBurnHearts(supabaseClient, user.id)
      case 'transfer_hearts':
        return await handleTransferHearts(supabaseClient, user.id, data)
      case 'add_activity':
        return await handleAddActivity(supabaseClient, user.id, data)
      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function handleCreatePost(supabaseClient: any, userId: string, data: any) {
  const { content } = data
  
  // Check user has enough hearts
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('hearts')
    .eq('id', userId)
    .single()

  if (!profile || profile.hearts < 2) {
    return new Response(JSON.stringify({ error: 'Not enough hearts' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Deduct hearts and create post
  const { error: updateError } = await supabaseClient
    .from('profiles')
    .update({ 
      hearts: profile.hearts - 2,
      total_hearts_spent: profile.total_hearts_spent + 2
    })
    .eq('id', userId)

  if (updateError) throw updateError

  const { error: postError } = await supabaseClient
    .from('posts')
    .insert([{ user_id: userId, content }])

  if (postError) throw postError

  // Add activity
  await supabaseClient
    .from('activity_feed')
    .insert([{ user_id: userId, activity_type: 'posted' }])

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function handleLikePost(supabaseClient: any, userId: string, data: any) {
  const { postId } = data

  // Check user has enough hearts
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('hearts')
    .eq('id', userId)
    .single()

  if (!profile || profile.hearts < 1) {
    return new Response(JSON.stringify({ error: 'Not enough hearts' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Get post author
  const { data: post } = await supabaseClient
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single()

  if (!post) {
    return new Response(JSON.stringify({ error: 'Post not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Add like
  const { error: likeError } = await supabaseClient
    .from('likes')
    .insert([{ user_id: userId, post_id: postId }])

  if (likeError) throw likeError

  // Deduct heart from liker
  await supabaseClient
    .from('profiles')
    .update({ 
      hearts: profile.hearts - 1,
      total_hearts_spent: profile.total_hearts_spent + 1
    })
    .eq('id', userId)

  // Get post author's current hearts to add to them
  const { data: authorProfile } = await supabaseClient
    .from('profiles')
    .select('hearts, total_hearts_earned')
    .eq('id', post.user_id)
    .single()

  if (authorProfile) {
    // Add heart to post author
    await supabaseClient
      .from('profiles')
      .update({ 
        hearts: authorProfile.hearts + 1,
        total_hearts_earned: authorProfile.total_hearts_earned + 1
      })
      .eq('id', post.user_id)
  }

  // Add activity
  await supabaseClient
    .from('activity_feed')
    .insert([{ user_id: post.user_id, activity_type: 'received_like' }])

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function handleUnlikePost(supabaseClient: any, userId: string, data: any) {
  const { postId } = data

  // Get post author
  const { data: post } = await supabaseClient
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single()

  if (!post) {
    return new Response(JSON.stringify({ error: 'Post not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Remove like
  const { error: unlikeError } = await supabaseClient
    .from('likes')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId)

  if (unlikeError) throw unlikeError

  // Get current user hearts to return heart
  const { data: userProfile } = await supabaseClient
    .from('profiles')
    .select('hearts, total_hearts_spent')
    .eq('id', userId)
    .single()

  if (userProfile) {
    // Return heart to liker
    await supabaseClient
      .from('profiles')
      .update({ 
        hearts: userProfile.hearts + 1,
        total_hearts_spent: Math.max(0, userProfile.total_hearts_spent - 1)
      })
      .eq('id', userId)
  }

  // Get post author's current hearts to subtract from them
  const { data: authorProfile } = await supabaseClient
    .from('profiles')
    .select('hearts, total_hearts_earned')
    .eq('id', post.user_id)
    .single()

  if (authorProfile) {
    // Remove heart from post author
    await supabaseClient
      .from('profiles')
      .update({ 
        hearts: Math.max(0, authorProfile.hearts - 1),
        total_hearts_earned: Math.max(0, authorProfile.total_hearts_earned - 1)
      })
      .eq('id', post.user_id)
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function handleCommentPost(supabaseClient: any, userId: string, data: any) {
  const { postId, content } = data

  // Check user has enough hearts
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('hearts')
    .eq('id', userId)
    .single()

  if (!profile || profile.hearts < 3) {
    return new Response(JSON.stringify({ error: 'Not enough hearts' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Get post author
  const { data: post } = await supabaseClient
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single()

  if (!post) {
    return new Response(JSON.stringify({ error: 'Post not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Add comment
  const { error: commentError } = await supabaseClient
    .from('comments')
    .insert([{ user_id: userId, post_id: postId, content }])

  if (commentError) throw commentError

  // Deduct hearts from commenter
  await supabaseClient
    .from('profiles')
    .update({ 
      hearts: profile.hearts - 3,
      total_hearts_spent: profile.total_hearts_spent + 3
    })
    .eq('id', userId)

  // Get post author's current hearts to add to them
  const { data: authorProfile } = await supabaseClient
    .from('profiles')
    .select('hearts, total_hearts_earned')
    .eq('id', post.user_id)
    .single()

  if (authorProfile) {
    // Add hearts to post author
    await supabaseClient
      .from('profiles')
      .update({ 
        hearts: authorProfile.hearts + 3,
        total_hearts_earned: authorProfile.total_hearts_earned + 3
      })
      .eq('id', post.user_id)
  }

  // Add activity
  await supabaseClient
    .from('activity_feed')
    .insert([{ user_id: post.user_id, activity_type: 'received_comment' }])

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function handleReviveUser(supabaseClient: any, userId: string, data: any) {
  const { targetUserId } = data

  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('hearts')
    .eq('id', userId)
    .single()

  if (!profile || profile.hearts < 1) {
    return new Response(JSON.stringify({ error: 'Not enough hearts' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Deduct heart from reviver
  await supabaseClient
    .from('profiles')
    .update({ 
      hearts: profile.hearts - 1,
      total_hearts_spent: profile.total_hearts_spent + 1,
      revives_given: profile.revives_given + 1
    })
    .eq('id', userId)

  // Get target user's current revives_received to increment it
  const { data: targetProfile } = await supabaseClient
    .from('profiles')
    .select('revives_received')
    .eq('id', targetUserId)
    .single()

  if (targetProfile) {
    // Revive target user
    await supabaseClient
      .from('profiles')
      .update({ 
        hearts: 10,
        status: 'alive',
        revives_received: targetProfile.revives_received + 1
      })
      .eq('id', targetUserId)
  }

  // Add activity
  await supabaseClient
    .from('activity_feed')
    .insert([{ user_id: targetUserId, activity_type: 'revived' }])

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function handleBurnHearts(supabaseClient: any, userId: string) {
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('hearts')
    .eq('id', userId)
    .single()

  if (!profile || profile.hearts === 0) {
    return new Response(JSON.stringify({ error: 'No hearts to burn' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  await supabaseClient
    .from('profiles')
    .update({ 
      hearts: 0,
      status: 'dead',
      total_hearts_spent: profile.total_hearts_spent + profile.hearts
    })
    .eq('id', userId)

  // Add activity
  await supabaseClient
    .from('activity_feed')
    .insert([{ user_id: userId, activity_type: 'burned_hearts' }])

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function handleTransferHearts(supabaseClient: any, userId: string, data: any) {
  const { targetUserId, amount } = data

  if (amount <= 0 || amount > 50) {
    return new Response(JSON.stringify({ error: 'Invalid amount' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('hearts')
    .eq('id', userId)
    .single()

  if (!profile || profile.hearts < amount) {
    return new Response(JSON.stringify({ error: 'Not enough hearts' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Get target user's current hearts and total_hearts_earned
  const { data: targetProfile } = await supabaseClient
    .from('profiles')
    .select('hearts, total_hearts_earned')
    .eq('id', targetUserId)
    .single()

  if (!targetProfile) {
    return new Response(JSON.stringify({ error: 'Target user not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Transfer hearts
  await supabaseClient
    .from('profiles')
    .update({ 
      hearts: profile.hearts - amount,
      total_hearts_spent: profile.total_hearts_spent + amount
    })
    .eq('id', userId)

  await supabaseClient
    .from('profiles')
    .update({ 
      hearts: targetProfile.hearts + amount,
      total_hearts_earned: targetProfile.total_hearts_earned + amount
    })
    .eq('id', targetUserId)

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function handleAddActivity(supabaseClient: any, userId: string, data: any) {
  const { activity_type, details } = data

  await supabaseClient
    .from('activity_feed')
    .insert([{ user_id: userId, activity_type, details }])

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
