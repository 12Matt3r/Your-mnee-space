// YourSpace Creative Labs - Artist Database
// Comprehensive profiles for all artists in the YourSpace ecosystem

export interface Artist {
  id: string;
  username: string;
  displayName: string;
  realName?: string;
  aliases?: string[];
  bio: string;
  longBio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  socialLinks: {
    website?: string;
    soundcloud?: string;
    bandcamp?: string;
    youtube?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
  };
  genres: string[];
  stats: {
    followers: number;
    totalViews: number;
    totalProjects: number;
  };
  featured: boolean;
  verified: boolean;
  createdAt: string;
}

export const artistsData: Artist[] = [
  {
    id: 'sofa-king-sad-boi',
    username: 'sofa_king_sad_boi',
    displayName: 'Sofa King Sad Boi',
    realName: 'Rave Charles',
    aliases: ['SKSB', 'Sofa King', 'Sad Boi'],
    bio: 'Underground rave scene electronic music producer and DJ. Twisting sound waves and weaving frequencies into hypnotic experiences.',
    longBio: `Sofa King Sad Boi is the moniker of Rave Charles, an American electronic music producer and DJ who has carved out a unique space in the underground rave scene. Known for twisting sound waves and weaving frequencies, Sofa King Sad Boi creates immersive sonic experiences that blend multiple forms of electronic music.

Born in the digital age, Sofa King Sad Boi grew up surrounded by the evolving sounds of internet culture, gaming, and experimental music. This diverse foundation has influenced their eclectic approach to production, which encompasses everything from lo-fi beats to high-energy rave anthems.

As a creator who identifies as neurodivergent (ASD, ADHD, Social Anxiety), Sofa King Sad Boi channels their unique perspective into music that resonates with listeners who feel like outsiders. Their work often explores themes of isolation, connection, nostalgia, and the search for belonging in digital spaces.

In addition to music production, Sofa King Sad Boi has expanded into interactive experiences, creating games and visual art collaborations that push the boundaries of what music can be in the digital age. Their collaborative work with 12matt3r has produced several viral AI-generated music videos that blend visual artistry with innovative sound design.

The name "Sofa King Sad Boi" reflects the duality of their artistic identity - the comfort and isolation of spending time at home (sofa) combined with the emotional depth (sad) and energy (king/boi) of their music.`,
    avatar: undefined,
    coverImage: undefined,
    location: 'United States',
    socialLinks: {
      soundcloud: 'https://soundcloud.com/sofakingsadboi',
      youtube: 'https://www.youtube.com/c/SofaKingSadboi',
      tiktok: '@sofakingsadboi',
      instagram: '@sofakingsadboi'
    },
    genres: ['Electronic', 'Lo-fi', 'Synthwave', 'Slushwave', 'Vaporwave', 'Rave', 'Experimental'],
    stats: {
      followers: 1500,
      totalViews: 45000,
      totalProjects: 67
    },
    featured: true,
    verified: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'drift-wave-static',
    username: 'drift_wave_static',
    displayName: 'Drift Wave Static',
    realName: 'Brandon Crosby',
    aliases: ['DriftWave', 'DWS', 'Drift'],
    bio: 'Slushwave artist creating drenched soundscapes built from warped nostalgia, faded memories, and slow-motion soul.',
    longBio: `Drift Wave Static is the sonic project of Brandon Crosby, a producer who has emerged as a leading voice in the contemporary slushwave scene. His music creates drenched soundscapes built from warped nostalgia, faded memories, and slow-motion soul.

The Drift Wave Static sound is characterized by what fans describe as "melted loops and submerged 808s" - a sonic palette that evokes the feeling of listening to a favorite song through water, distorted but beautiful, familiar yet strange. Drawing inspiration from the pioneering work of artists like t e l e p a t h テレパシー能力者, Drift Wave Static has developed a signature style that pays homage to the roots of slushwave while pushing the genre forward.

Slushwave, a subgenre of Vaporwave, is characterized by heavily layered tracks featuring phaser effects combined with high reverb and delay, creating hypnotic textures that are both melodic and narrative. Drift Wave Static embodies these characteristics while adding their own emotional depth.

As part of the Slushwave Social Club collective, Drift Wave Static contributes to a community of artists, labels, collectors, and visual artists who are passionate about keeping the slushwave aesthetic alive. Their work has been featured on compilations including "SSCC Volume 4: Recursive Summers" alongside other notable artists in the scene.

Drift Wave Static's music is available on Bandcamp, where they have released several beat tapes that have gained a cult following among fans of nostalgic electronic music.`,
    avatar: undefined,
    coverImage: undefined,
    location: 'United States',
    socialLinks: {
      bandcamp: 'https://driftwavestatic.bandcamp.com/',
      youtube: 'https://www.youtube.com/@DriftWaveStatic',
      soundcloud: 'https://soundcloud.com/driftwavestatic'
    },
    genres: ['Slushwave', 'Vaporwave', 'Lo-fi', 'Experimental', 'Ambient', 'Chillout'],
    stats: {
      followers: 800,
      totalViews: 25000,
      totalProjects: 15
    },
    featured: true,
    verified: false,
    createdAt: '2024-06-15T00:00:00Z'
  },
  {
    id: '12matt3r',
    username: '12matt3r',
    displayName: '12Matt3r',
    realName: 'Matt Riddle (artist name)',
    aliases: ['12matt3r', 'Matt3r', 'M12'],
    bio: 'Hybrid new media experience designer, filmmaker, producer, and rapper creating positive vibes through AI-enhanced visual artistry.',
    longBio: `12Matt3r is a hybrid new media experience designer, filmmaker, producer, and rapper who has made significant contributions to the intersection of music, technology, and visual art. Known for bringing positive vibes and technical excellence to every project, 12Matt3r represents the new generation of multimedia artists who blur the lines between traditional creative disciplines.

Based in the United States, 12Matt3r has developed a reputation for innovative approaches to visual storytelling. Their work often incorporates cutting-edge AI animation techniques, creating mind-bending visual experiences that complement their musical collaborations. This technical expertise has led to partnerships with artists like Sofa King Sad Boi, resulting in several viral AI-generated music videos.

The collaboration between 12Matt3r and Sofa King Sad Boi has produced notable works including "The Exorcism of Lofi Girl" which garnered attention on platforms like TikTok and YouTube. Their video for "{voidtv} Presents: Sofa King Sad Boi - Artistic Visual Delights!" showcases the potential of AI hallucinations to transform normal visual content into psychedelic masterpieces.

In addition to their visual work, 12Matt3r is an accomplished rapper and producer who brings a positive, uplifting energy to their musical projects. Their approach to art emphasizes connection, community, and the use of technology as a tool for creative expression rather than replacement for human artistry.

12Matt3r is associated with Nuvotion Visuals, a collective that shares stages with major artists including Griz, Juice Wrld, Wiz Khalifa, and MGK, and has performed at festivals like Digital Gardens, Camp Bisco, and Vans Warped Tour.`,
    avatar: undefined,
    coverImage: undefined,
    location: 'United States',
    socialLinks: {
      instagram: '@12matt3r',
      youtube: 'https://www.youtube.com/@12matt3r',
      website: 'https://nuvotion.live/artists'
    },
    genres: ['New Media', 'AI Art', 'Hip Hop', 'Electronic', 'Experimental', 'Visual Art'],
    stats: {
      followers: 500,
      totalViews: 15000,
      totalProjects: 20
    },
    featured: true,
    verified: false,
    createdAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'tanky-johnson',
    username: 'tanky_johnson',
    displayName: 'Tanky Johnson',
    realName: 'Artist Name Reserved',
    aliases: ['formerly known as Kanye T', 'Tank', 'Tanky J'],
    bio: 'Alias transition complete. New artistic identity emerging with fresh sounds and creative direction.',
    longBio: `Tanky Johnson represents an artistic evolution - a new identity emerging from a previous chapter. As the current alias for what was formerly known as Kanye T, Tanky Johnson marks a deliberate shift in creative direction and artistic expression.

This name change reflects a transformation in both sound and vision, embracing a new persona that captures the essence of the artist's current creative journey. The name "Tanky" suggests resilience, strength, and the ability to weather challenges - qualities that resonate with the artist's experience navigating the ever-changing landscape of digital music and content creation.

While specific details about Tanky Johnson's discography and projects are still emerging, the transition from Kanye T to Tanky Johnson signals an exciting new chapter. Fans and followers can expect fresh sounds, new collaborations, and a refined artistic vision that builds upon the foundation established under the previous alias.

The choice of "Johnson" as a surname is significant - it's one of the most common surnames in America, symbolizing accessibility, relatability, and connection to a broader audience. This reflects the artist's desire to create music that resonates with everyday people while maintaining artistic integrity.

As Tanky Johnson develops their presence on YourSpace, this profile will be updated with information about their projects, collaborations, and the unique contributions they bring to the platform.`,
    avatar: undefined,
    coverImage: undefined,
    location: 'United States',
    socialLinks: {
      instagram: '@tankyjohnson',
      tiktok: '@tankyjohnson'
    },
    genres: ['Electronic', 'Hip Hop', 'Experimental', 'To Be Determined'],
    stats: {
      followers: 0,
      totalViews: 0,
      totalProjects: 0
    },
    featured: false,
    verified: false,
    createdAt: '2025-01-10T00:00:00Z'
  },
  {
    id: 'rave-charles',
    username: 'rave_charles',
    displayName: 'Rave Charles',
    aliases: ['Sofa King Sad Boi (Real Name)', 'RC'],
    bio: 'The real identity behind Sofa King Sad Boi. Underground electronic music producer creating transformative sonic experiences.',
    longBio: `Rave Charles is the real name behind the Sofa King Sad Boi moniker, revealing the human artist behind the digital persona. While Sofa King Sad Boi represents the public facing brand of electronic music production, Rave Charles is the individual artist whose vision, creativity, and life experiences shape every track and project.

As an American artist in their early 20s, Rave Charles represents a generation that grew up fully immersed in internet culture. This background has profoundly influenced their approach to music production, which seamlessly blends elements from gaming soundtracks, anime opening themes, viral internet trends, and underground rave culture.

Identifying as neurodivergent (with ASD, ADHD, and Social Anxiety), Rave Charles brings a unique perspective to their art. Rather than viewing these conditions as limitations, they channel the different ways of experiencing the world into music that resonates with listeners who often feel like outsiders in mainstream culture.

The dual identity of Rave Charles and Sofa King Sad Boi allows for creative flexibility - Rave Charles can explore more personal, introspective projects under their real name, while Sofa King Sad Boi can embrace the dramatic, energetic persona that their fans know and love.

Beyond music, Rave Charles has demonstrated versatility by creating games and interactive experiences on platforms like Websim, showing that their creative vision extends far beyond audio production. This multidisciplinary approach positions them as a true "new media" artist in the fullest sense of the term.

The Facebook presence of Rave Charles (Sofa King Sad boi) describes them as "twisting sound waves and weaving frequencies, producing and DJing many forms of electronic music" - a mission statement that captures their artistic philosophy of transformation and creativity.`,
    avatar: undefined,
    coverImage: undefined,
    location: 'United States',
    socialLinks: {
      facebook: 'https://www.facebook.com/sofakingsadboi/',
      soundcloud: 'https://soundcloud.com/sofakingsadboi',
      youtube: 'https://www.youtube.com/c/SofaKingSadboi'
    },
    genres: ['Electronic', 'Rave', 'Lo-fi', 'Synthwave', 'Experimental', 'Game Music'],
    stats: {
      followers: 2000,
      totalViews: 60000,
      totalProjects: 67
    },
    featured: true,
    verified: false,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Helper functions for accessing artist data
export const getArtistById = (id: string): Artist | undefined => {
  return artistsData.find(artist => artist.id === id);
};

export const getArtistByUsername = (username: string): Artist | undefined => {
  return artistsData.find(artist => artist.username === username);
};

export const getFeaturedArtists = (): Artist[] => {
  return artistsData.filter(artist => artist.featured);
};

export const searchArtists = (query: string): Artist[] => {
  const lowerQuery = query.toLowerCase();
  return artistsData.filter(artist => 
    artist.displayName.toLowerCase().includes(lowerQuery) ||
    artist.username.toLowerCase().includes(lowerQuery) ||
    artist.bio.toLowerCase().includes(lowerQuery) ||
    artist.genres.some(genre => genre.toLowerCase().includes(lowerQuery))
  );
};

export const getArtistsByGenre = (genre: string): Artist[] => {
  return artistsData.filter(artist => 
    artist.genres.some(g => g.toLowerCase() === genre.toLowerCase())
  );
};

export default artistsData;
