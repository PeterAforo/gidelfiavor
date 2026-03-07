/**
 * Social Media API Integration Service
 * Handles fetching posts from various social media platforms
 */

// Twitter/X API Integration
export async function fetchTwitterPosts(accessToken, accountName, limit = 10) {
  try {
    // Twitter API v2 - Get user tweets
    // First get user ID from username
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${accountName.replace('@', '')}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!userResponse.ok) {
      const error = await userResponse.json();
      throw new Error(error.detail || 'Failed to fetch Twitter user');
    }
    
    const userData = await userResponse.json();
    const userId = userData.data?.id;
    
    if (!userId) {
      throw new Error('Twitter user not found');
    }
    
    // Get user's tweets
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=${Math.min(limit, 100)}&tweet.fields=created_at,public_metrics,attachments&expansions=attachments.media_keys&media.fields=url,preview_image_url`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!tweetsResponse.ok) {
      const error = await tweetsResponse.json();
      throw new Error(error.detail || 'Failed to fetch tweets');
    }
    
    const tweetsData = await tweetsResponse.json();
    const mediaMap = {};
    
    // Build media map from includes
    if (tweetsData.includes?.media) {
      tweetsData.includes.media.forEach(media => {
        mediaMap[media.media_key] = media.url || media.preview_image_url;
      });
    }
    
    // Transform to our format
    return (tweetsData.data || []).map(tweet => ({
      post_id: tweet.id,
      content: tweet.text,
      media_url: tweet.attachments?.media_keys?.[0] ? mediaMap[tweet.attachments.media_keys[0]] : null,
      likes_count: tweet.public_metrics?.like_count || 0,
      comments_count: tweet.public_metrics?.reply_count || 0,
      shares_count: tweet.public_metrics?.retweet_count || 0,
      posted_at: tweet.created_at,
      platform: 'twitter',
    }));
  } catch (error) {
    console.error('Twitter API Error:', error.message);
    throw error;
  }
}

// Facebook API Integration
export async function fetchFacebookPosts(accessToken, pageId, limit = 10) {
  try {
    // Facebook Graph API - Get page posts
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/posts?fields=id,message,full_picture,created_time,shares,reactions.summary(true),comments.summary(true)&limit=${limit}&access_token=${accessToken}`
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to fetch Facebook posts');
    }
    
    const data = await response.json();
    
    return (data.data || []).map(post => ({
      post_id: post.id,
      content: post.message || '',
      media_url: post.full_picture || null,
      likes_count: post.reactions?.summary?.total_count || 0,
      comments_count: post.comments?.summary?.total_count || 0,
      shares_count: post.shares?.count || 0,
      posted_at: post.created_time,
      platform: 'facebook',
    }));
  } catch (error) {
    console.error('Facebook API Error:', error.message);
    throw error;
  }
}

// Instagram API Integration (Basic Display API or Graph API for Business accounts)
export async function fetchInstagramPosts(accessToken, accountId, limit = 10) {
  try {
    // Instagram Graph API - Get media
    const response = await fetch(
      `https://graph.instagram.com/v18.0/${accountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count&limit=${limit}&access_token=${accessToken}`
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to fetch Instagram posts');
    }
    
    const data = await response.json();
    
    return (data.data || []).map(post => ({
      post_id: post.id,
      content: post.caption || '',
      media_url: post.media_url || post.thumbnail_url || null,
      likes_count: post.like_count || 0,
      comments_count: post.comments_count || 0,
      shares_count: 0,
      posted_at: post.timestamp,
      platform: 'instagram',
    }));
  } catch (error) {
    console.error('Instagram API Error:', error.message);
    throw error;
  }
}

// LinkedIn API Integration
export async function fetchLinkedInPosts(accessToken, organizationId, limit = 10) {
  try {
    // LinkedIn API - Get organization posts
    const response = await fetch(
      `https://api.linkedin.com/v2/shares?q=owners&owners=urn:li:organization:${organizationId}&count=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch LinkedIn posts');
    }
    
    const data = await response.json();
    
    return (data.elements || []).map(post => ({
      post_id: post.id,
      content: post.text?.text || post.commentary || '',
      media_url: post.content?.contentEntities?.[0]?.thumbnails?.[0]?.resolvedUrl || null,
      likes_count: 0, // Would need separate API call for social actions
      comments_count: 0,
      shares_count: 0,
      posted_at: new Date(post.created?.time || Date.now()).toISOString(),
      platform: 'linkedin',
    }));
  } catch (error) {
    console.error('LinkedIn API Error:', error.message);
    throw error;
  }
}

// YouTube API Integration
export async function fetchYouTubePosts(apiKey, channelId, limit = 10) {
  try {
    // YouTube Data API v3 - Get channel videos
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${limit}&order=date&type=video&key=${apiKey}`
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to fetch YouTube videos');
    }
    
    const data = await response.json();
    const videoIds = data.items?.map(item => item.id.videoId).join(',');
    
    // Get video statistics
    let statsMap = {};
    if (videoIds) {
      const statsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${apiKey}`
      );
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        statsData.items?.forEach(item => {
          statsMap[item.id] = item.statistics;
        });
      }
    }
    
    return (data.items || []).map(item => {
      const stats = statsMap[item.id.videoId] || {};
      return {
        post_id: item.id.videoId,
        content: item.snippet.title,
        media_url: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        likes_count: parseInt(stats.likeCount) || 0,
        comments_count: parseInt(stats.commentCount) || 0,
        shares_count: 0,
        posted_at: item.snippet.publishedAt,
        platform: 'youtube',
        video_url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      };
    });
  } catch (error) {
    console.error('YouTube API Error:', error.message);
    throw error;
  }
}

// Main function to fetch posts based on platform
export async function fetchSocialPosts(platform, credentials, limit = 10) {
  const { accessToken, accountName, accountId, apiKey, channelId, pageId, organizationId } = credentials;
  
  switch (platform) {
    case 'twitter':
      return fetchTwitterPosts(accessToken, accountName, limit);
    case 'facebook':
      return fetchFacebookPosts(accessToken, pageId || accountId, limit);
    case 'instagram':
      return fetchInstagramPosts(accessToken, accountId || 'me', limit);
    case 'linkedin':
      return fetchLinkedInPosts(accessToken, organizationId || accountId, limit);
    case 'youtube':
      return fetchYouTubePosts(apiKey || accessToken, channelId || accountId, limit);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}
