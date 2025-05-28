
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const requestBody = await req.json()
    const { action, postId, targetUserId, content } = requestBody

    console.log('Heart transaction:', { action, postId, targetUserId, content, userId: user.id })

    switch (action) {
      case 'create_post': {
        // Get user's current hearts
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('hearts, status')
          .eq('id', user.id)
          .single()

        if (!userProfile || userProfile.hearts < 2 || userProfile.status === 'dead') {
          throw new Error('Insufficient hearts or user is dead')
        }

        // Deduct 2 hearts from user for creating post
        await supabase
          .from('profiles')
          .update({ 
            hearts: userProfile.hearts - 2,
            total_hearts_spent: supabase.sql`total_hearts_spent + 2`
          })
          .eq('id', user.id)

        // Create the post
        const { data: newPost, error: postError } = await supabase
          .from('posts')
          .insert({ user_id: user.id, content })
          .select()
          .single()

        if (postError) throw postError

        break
      }

      case 'like_post': {
        // Get user's current hearts
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('hearts, status')
          .eq('id', user.id)
          .single()

        if (!userProfile || userProfile.hearts < 1 || userProfile.status === 'dead') {
          throw new Error('Insufficient hearts or user is dead')
        }

        // Check if already liked
        const { data: existingLike } = await supabase
          .from('likes')
          .select('id')
          .eq('user_id', user.id)
          .eq('post_id', postId)
          .single()

        if (existingLike) {
          throw new Error('Post already liked')
        }

        // Get post author
        const { data: post } = await supabase
          .from('posts')
          .select('user_id')
          .eq('id', postId)
          .single()

        if (!post) {
          throw new Error('Post not found')
        }

        // Start transaction
        // 1. Deduct 1 heart from liker
        await supabase
          .from('profiles')
          .update({ 
            hearts: userProfile.hearts - 1,
            total_hearts_spent: supabase.sql`total_hearts_spent + 1`
          })
          .eq('id', user.id)

        // 2. Add 1 heart to post author
        await supabase
          .from('profiles')
          .update({ 
            hearts: supabase.sql`hearts + 1`,
            total_hearts_earned: supabase.sql`total_hearts_earned + 1`
          })
          .eq('id', post.user_id)

        // 3. Create like record
        await supabase
          .from('likes')
          .insert({ user_id: user.id, post_id: postId })

        break
      }

      case 'unlike_post': {
        // Get existing like
        const { data: existingLike } = await supabase
          .from('likes')
          .select('id')
          .eq('user_id', user.id)
          .eq('post_id', postId)
          .single()

        if (!existingLike) {
          throw new Error('Like not found')
        }

        // Get post author
        const { data: post } = await supabase
          .from('posts')
          .select('user_id')
          .eq('id', postId)
          .single()

        if (!post) {
          throw new Error('Post not found')
        }

        // Start transaction
        // 1. Add heart back to liker
        await supabase
          .from('profiles')
          .update({ 
            hearts: supabase.sql`hearts + 1`,
            total_hearts_spent: supabase.sql`total_hearts_spent - 1`
          })
          .eq('id', user.id)

        // 2. Remove heart from post author
        await supabase
          .from('profiles')
          .update({ 
            hearts: supabase.sql`hearts - 1`,
            total_hearts_earned: supabase.sql`total_hearts_earned - 1`
          })
          .eq('id', post.user_id)

        // 3. Delete like record
        await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id)

        break
      }

      case 'comment_post': {
        // Get user's current hearts
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('hearts, status')
          .eq('id', user.id)
          .single()

        if (!userProfile || userProfile.hearts < 3 || userProfile.status === 'dead') {
          throw new Error('Insufficient hearts or user is dead')
        }

        // Get post author
        const { data: post } = await supabase
          .from('posts')
          .select('user_id')
          .eq('id', postId)
          .single()

        if (!post) {
          throw new Error('Post not found')
        }

        // 1. Deduct 3 hearts from commenter
        await supabase
          .from('profiles')
          .update({ 
            hearts: userProfile.hearts - 3,
            total_hearts_spent: supabase.sql`total_hearts_spent + 3`
          })
          .eq('id', user.id)

        // 2. Add 3 hearts to post author
        await supabase
          .from('profiles')
          .update({ 
            hearts: supabase.sql`hearts + 3`,
            total_hearts_earned: supabase.sql`total_hearts_earned + 3`
          })
          .eq('id', post.user_id)

        // 3. Create comment
        await supabase
          .from('comments')
          .insert({ user_id: user.id, post_id: postId, content })

        break
      }

      case 'revive_user': {
        // Get reviver's current hearts
        const { data: reviverProfile } = await supabase
          .from('profiles')
          .select('hearts, status')
          .eq('id', user.id)
          .single()

        if (!reviverProfile || reviverProfile.hearts < 1 || reviverProfile.status === 'dead') {
          throw new Error('Insufficient hearts or reviver is dead')
        }

        // Get target user's status
        const { data: targetProfile } = await supabase
          .from('profiles')
          .select('status, hearts')
          .eq('id', targetUserId)
          .single()

        if (!targetProfile || targetProfile.status !== 'dead') {
          throw new Error('Target user is not dead')
        }

        // 1. Deduct 1 heart from reviver
        await supabase
          .from('profiles')
          .update({ 
            hearts: reviverProfile.hearts - 1,
            total_hearts_spent: supabase.sql`total_hearts_spent + 1`,
            revives_given: supabase.sql`revives_given + 1`
          })
          .eq('id', user.id)

        // 2. Give 10 hearts to dead user (will trigger status change)
        await supabase
          .from('profiles')
          .update({ 
            hearts: 10,
            total_hearts_earned: supabase.sql`total_hearts_earned + 10`,
            revives_received: supabase.sql`revives_received + 1`
          })
          .eq('id', targetUserId)

        break
      }

      case 'burn_hearts': {
        // Set user's hearts to 0 (will trigger status change to dead)
        await supabase
          .from('profiles')
          .update({ hearts: 0 })
          .eq('id', user.id)

        break
      }

      default:
        throw new Error('Invalid action')
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Heart transaction error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
