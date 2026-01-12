Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Query the artists table directly
        const artistsQuery = `${supabaseUrl}/rest/v1/artists?select=*&order=featured.desc,verified.desc,created_at.desc&limit=20`;

        const artistsResponse = await fetch(artistsQuery, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        if (!artistsResponse.ok) {
            throw new Error('Failed to get artists');
        }

        const artists = await artistsResponse.json();

        // Transform artists to expected format for frontend
        const transformedArtists = artists.map((artist: any) => ({
            id: artist.id,
            user_id: artist.id,
            username: artist.username,
            display_name: artist.display_name,
            full_name: artist.display_name,
            bio: artist.bio,
            long_bio: artist.long_bio,
            avatar_url: artist.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${artist.username}`,
            cover_image: artist.cover_image,
            location: artist.location,
            genres: artist.genres || [],
            stats: artist.stats || { followers: 0, totalViews: 0, totalProjects: 0 },
            social_links: artist.social_links || {},
            featured: artist.featured,
            is_verified: artist.verified,
            verified: artist.verified,
            follower_count: artist.stats?.followers || 0,
            reputation_score: artist.stats?.followers || 0,
            content_samples: []
        }));

        // Shuffle for variety
        for (let i = transformedArtists.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [transformedArtists[i], transformedArtists[j]] = [transformedArtists[j], transformedArtists[i]];
        }

        return new Response(JSON.stringify({ 
            data: transformedArtists,
            isAnonymous: true 
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get artist stack error:', error);

        const errorResponse = {
            error: {
                code: 'GET_ARTIST_STACK_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
