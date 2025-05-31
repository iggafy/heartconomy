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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, userId, postId, commentId, amount, content, parentCommentId } = await req.json()
    
    console.log('Heart transaction request:', { action, userId, postId, commentId, amount, content, parentCommentId })

    // Get the current user from the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const currentUserId = user.id

    // Get current user's profile
    const { data: currentProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', currentUserId)
      .single()

    if (profileError || !currentProfile) {
      return new Response(JSON.stringify({ error: 'User profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Check if user is alive for most actions
    if (currentProfile.status === 'dead' && action !== 'revive_user') {
      return new Response(JSON.stringify({ error: 'Dead users cannot perform heart transactions' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'create_post') {
      // Check if user has enough hearts
      if (currentProfile.hearts < 2) {
        return new Response(JSON.stringify({ error: 'Not enough hearts (posting costs 2 hearts)' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      if (!content || !content.trim()) {
        return new Response(JSON.stringify({ error: 'Content is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Create the post
      const { data: newPost, error: postError } = await supabaseClient
        .from('posts')
        .insert({
          user_id: currentUserId,
          content: content.trim()
        })
        .select()
        .single()

      if (postError) {
        console.error('Error creating post:', postError)
        return new Response(JSON.stringify({ error: 'Failed to create post' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Deduct hearts from user
      await supabaseClient
        .from('profiles')
        .update({ 
          hearts: currentProfile.hearts - 2,
          total_hearts_spent: currentProfile.total_hearts_spent + 2
        })
        .eq('id', currentUserId)

      // Create activity feed entry
      await supabaseClient.from('activity_feed').insert({
        user_id: currentUserId,
        activity_type: 'post_created',
        details: { post_id: newPost.id }
      })

      return new Response(JSON.stringify({ success: true, post: newPost }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'comment_post') {
      // Check if user has enough hearts
      if (currentProfile.hearts < 3) {
        return new Response(JSON.stringify({ error: 'Not enough hearts (commenting costs 3 hearts)' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      if (!content || !content.trim()) {
        return new Response(JSON.stringify({ error: 'Content is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      if (!postId) {
        return new Response(JSON.stringify({ error: 'Post ID is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Create the comment
      const { data: newComment, error: commentError } = await supabaseClient
        .from('comments')
        .insert({
          user_id: currentUserId,
          post_id: postId,
          content: content.trim(),
          parent_comment_id: parentCommentId || null
        })
        .select()
        .single()

      if (commentError) {
        console.error('Error creating comment:', commentError)
        return new Response(JSON.stringify({ error: 'Failed to create comment' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Deduct hearts from user
      await supabaseClient
        .from('profiles')
        .update({ 
          hearts: currentProfile.hearts - 3,
          total_hearts_spent: currentProfile.total_hearts_spent + 3
        })
        .eq('id', currentUserId)

      // Create activity feed entry
      await supabaseClient.from('activity_feed').insert({
        user_id: currentUserId,
        activity_type: 'comment_created',
        details: { post_id: postId, comment_id: newComment.id, parent_comment_id: parentCommentId }
      })

      return new Response(JSON.stringify({ success: true, comment: newComment }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'like_post') {
      // Check if user has enough hearts
      if (currentProfile.hearts < 1) {
        return new Response(JSON.stringify({ error: 'Not enough hearts' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Get post details
      const { data: post, error: postError } = await supabaseClient
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single()

      if (postError || !post) {
        return new Response(JSON.stringify({ error: 'Post not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Cannot like own post
      if (post.user_id === currentUserId) {
        return new Response(JSON.stringify({ error: 'Cannot like your own post' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Create the like
      const { error: likeError } = await supabaseClient
        .from('likes')
        .insert({
          user_id: currentUserId,
          post_id: postId
        })

      if (likeError) {
        console.error('Error creating like:', likeError)
        return new Response(JSON.stringify({ error: 'Failed to like post' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Update hearts
      await supabaseClient
        .from('profiles')
        .update({ 
          hearts: currentProfile.hearts - 1,
          total_hearts_spent: currentProfile.total_hearts_spent + 1
        })
        .eq('id', currentUserId)

      const { data: postOwner } = await supabaseClient
        .from('profiles')
        .select('hearts, total_hearts_earned')
        .eq('id', post.user_id)
        .single()

      if (postOwner) {
        await supabaseClient
          .from('profiles')
          .update({ 
            hearts: postOwner.hearts + 1,
            total_hearts_earned: postOwner.total_hearts_earned + 1
          })
          .eq('id', post.user_id)
      }

      // Create activity feed entries
      await supabaseClient.from('activity_feed').insert([
        {
          user_id: currentUserId,
          activity_type: 'like_given',
          details: { post_id: postId, recipient_id: post.user_id }
        },
        {
          user_id: post.user_id,
          activity_type: 'like_received',
          details: { post_id: postId, giver_id: currentUserId }
        }
      ])

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'like_comment') {
      // Check if user has enough hearts
      if (currentProfile.hearts < 1) {
        return new Response(JSON.stringify({ error: 'Not enough hearts' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Get comment details
      const { data: comment, error: commentError } = await supabaseClient
        .from('comments')
        .select('user_id, post_id')
        .eq('id', commentId)
        .single()

      if (commentError || !comment) {
        return new Response(JSON.stringify({ error: 'Comment not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Cannot like own comment
      if (comment.user_id === currentUserId) {
        return new Response(JSON.stringify({ error: 'Cannot like your own comment' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Update hearts
      await supabaseClient
        .from('profiles')
        .update({ 
          hearts: currentProfile.hearts - 1,
          total_hearts_spent: currentProfile.total_hearts_spent + 1
        })
        .eq('id', currentUserId)

      const { data: commentOwner } = await supabaseClient
        .from('profiles')
        .select('hearts, total_hearts_earned')
        .eq('id', comment.user_id)
        .single()

      if (commentOwner) {
        await supabaseClient
          .from('profiles')
          .update({ 
            hearts: commentOwner.hearts + 1,
            total_hearts_earned: commentOwner.total_hearts_earned + 1
          })
          .eq('id', comment.user_id)
      }

      // Create activity feed entries
      await supabaseClient.from('activity_feed').insert([
        {
          user_id: currentUserId,
          activity_type: 'comment_like_given',
          details: { comment_id: commentId, post_id: comment.post_id, recipient_id: comment.user_id }
        },
        {
          user_id: comment.user_id,
          activity_type: 'comment_like_received',
          details: { comment_id: commentId, post_id: comment.post_id, giver_id: currentUserId }
        }
      ])

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'burn_hearts') {
      // Check if user has any hearts to burn
      if (currentProfile.hearts === 0) {
        return new Response(JSON.stringify({ error: 'No hearts to burn' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Burn all hearts (set to 0, which will trigger the status update via database trigger)
      await supabaseClient
        .from('profiles')
        .update({ 
          hearts: 0,
          total_hearts_spent: currentProfile.total_hearts_spent + currentProfile.hearts
        })
        .eq('id', currentUserId)

      // Create activity feed entry
      await supabaseClient.from('activity_feed').insert({
        user_id: currentUserId,
        activity_type: 'hearts_burned',
        details: { hearts_burned: currentProfile.hearts }
      })

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'revive_user') {
      // Check if user has enough hearts - FIXED: Now costs 10 hearts
      if (currentProfile.hearts < 10) {
        return new Response(JSON.stringify({ error: 'Not enough hearts (revive costs 10 hearts)' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Get target user's profile
      const { data: targetProfile, error: targetError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (targetError || !targetProfile) {
        return new Response(JSON.stringify({ error: 'Target user not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Check if target user is actually dead
      if (targetProfile.status !== 'dead') {
        return new Response(JSON.stringify({ error: 'User is not dead' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Cannot revive yourself
      if (userId === currentUserId) {
        return new Response(JSON.stringify({ error: 'Cannot revive yourself' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Update hearts: deduct 10 from reviver, give 10 to revived user
      await supabaseClient
        .from('profiles')
        .update({ 
          hearts: currentProfile.hearts - 10,
          total_hearts_spent: currentProfile.total_hearts_spent + 10,
          revives_given: currentProfile.revives_given + 1
        })
        .eq('id', currentUserId)

      // FIXED: Give 10 hearts to revived user and set status to alive
      await supabaseClient
        .from('profiles')
        .update({ 
          hearts: targetProfile.hearts + 10,
          total_hearts_earned: targetProfile.total_hearts_earned + 10,
          status: 'alive',
          revives_received: targetProfile.revives_received + 1
        })
        .eq('id', userId)

      // Create activity feed entries
      await supabaseClient.from('activity_feed').insert([
        {
          user_id: currentUserId,
          activity_type: 'revive_given',
          details: { recipient_id: userId }
        },
        {
          user_id: userId,
          activity_type: 'revive_received',
          details: { giver_id: currentUserId }
        }
      ])

      // Create notification for revived user
      await supabaseClient.from('notifications').insert({
        user_id: userId,
        type: 'revive',
        title: 'You have been revived!',
        message: `${currentProfile.username} revived you and gave you 10 hearts!`,
        data: { giver_id: currentUserId, hearts_given: 10 }
      })

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'transfer_hearts') {
      // Validate amount
      if (!amount || amount < 1) {
        return new Response(JSON.stringify({ error: 'Invalid amount' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Check if user has enough hearts
      if (currentProfile.hearts < amount) {
        return new Response(JSON.stringify({ error: 'Not enough hearts' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Get target user's profile
      const { data: targetProfile, error: targetError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (targetError || !targetProfile) {
        return new Response(JSON.stringify({ error: 'Target user not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Cannot transfer to yourself
      if (userId === currentUserId) {
        return new Response(JSON.stringify({ error: 'Cannot transfer hearts to yourself' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Update hearts
      await supabaseClient
        .from('profiles')
        .update({ 
          hearts: currentProfile.hearts - amount,
          total_hearts_spent: currentProfile.total_hearts_spent + amount
        })
        .eq('id', currentUserId)

      await supabaseClient
        .from('profiles')
        .update({ 
          hearts: targetProfile.hearts + amount,
          total_hearts_earned: targetProfile.total_hearts_earned + amount
        })
        .eq('id', userId)

      // Create activity feed entries
      await supabaseClient.from('activity_feed').insert([
        {
          user_id: currentUserId,
          activity_type: 'hearts_sent',
          details: { recipient_id: userId, amount }
        },
        {
          user_id: userId,
          activity_type: 'hearts_received',
          details: { giver_id: currentUserId, amount }
        }
      ])

      // Create notification for recipient
      await supabaseClient.from('notifications').insert({
        user_id: userId,
        type: 'hearts_received',
        title: 'Hearts received!',
        message: `${currentProfile.username} sent you ${amount} hearts!`,
        data: { giver_id: currentUserId, amount }
      })

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
