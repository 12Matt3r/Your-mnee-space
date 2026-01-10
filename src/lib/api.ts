import { supabase } from '../lib/supabase';

// Social media API functions
export const socialApi = {
  // Posts
  async createPost(text: string) {
    const { data, error } = await supabase.functions.invoke('create-post', {
      body: { content: text }
    });
    
    if (error) throw error;
    return data?.data || data;
  },

  async deletePost(postId: string) {
    const { data, error } = await supabase.functions.invoke('delete-post', {
      body: { postId }
    });
    
    if (error) throw error;
    return data?.data || data;
  },

  async getPosts(limit = 20) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles(
          id,
          display_name,
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async getPostReplyCount(postId: string) {
    const { count, error } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('reply_to_id', postId);

    if (error) throw error;
    return count || 0;
  },

  // Likes
  async likePost(postId: string) {
    const { data, error } = await supabase.functions.invoke('like-post', {
      body: { postId }
    });
    
    if (error) throw error;
    return data?.data || data;
  },

  async unlikePost(postId: string) {
    const { data, error } = await supabase.functions.invoke('unlike-post', {
      body: { postId }
    });
    
    if (error) throw error;
    return data?.data || data;
  },

  async getPostLikes(postId: string) {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId);

    if (error) throw error;
    return data;
  },

  async getPostLikeCount(postId: string) {
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    if (error) throw error;
    return count || 0;
  },

  async checkIfUserLikedPost(postId: string, userId: string) {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  // Bookmarks
  async bookmarkPost(postId: string) {
    const { data, error } = await supabase.functions.invoke('create-bookmark', {
      body: { postId }
    });
    
    if (error) throw error;
    return data?.data || data;
  },

  async unbookmarkPost(postId: string) {
    const { data, error } = await supabase.functions.invoke('delete-bookmark', {
      body: { postId }
    });
    
    if (error) throw error;
    return data?.data || data;
  },

  async getPostBookmarks(postId: string) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('post_id', postId);

    if (error) throw error;
    return data;
  },

  async getPostBookmarkCount(postId: string) {
    const { count, error } = await supabase
      .from('bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    if (error) throw error;
    return count || 0;
  },

  async checkIfUserBookmarkedPost(postId: string, userId: string) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  async getUserInteractionsForPosts(postIds: string[], userId: string) {
    const [likedData, bookmarkedData] = await Promise.all([
      supabase.from('likes').select('post_id').eq('user_id', userId).in('post_id', postIds),
      supabase.from('bookmarks').select('post_id').eq('user_id', userId).in('post_id', postIds)
    ]);

    if (likedData.error) throw likedData.error;
    if (bookmarkedData.error) throw bookmarkedData.error;

    const likedPostIds = new Set(likedData.data.map(item => item.post_id));
    const bookmarkedPostIds = new Set(bookmarkedData.data.map(item => item.post_id));

    return { likedPostIds, bookmarkedPostIds };
  },

  // Hashtags
  async getTrendingHashtags(limit = 10) {
    const { data, error } = await supabase
      .from('hashtags')
      .select(`
        *,
        post_hashtags(post_id)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Users/Profiles
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async getCurrentUserProfile() {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getSuggestedUsers(limit = 5) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Authentication
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        },
        emailRedirectTo: `${window.location.protocol}//${window.location.host}/auth/callback`
      }
    });
    
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};