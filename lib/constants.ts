export const SITE_CONFIG = {
    name: 'VibeVision',
    description: 'AI-powered platform for music and comedy content creation',
    url: 'https://vibevision.app',
    ogImage: 'https://vibevision.app/og.jpg',
    links: {
      twitter: 'https://twitter.com/vibevision',
      github: 'https://github.com/vibevision',
    },
  };
  
  export const API_ENDPOINTS = {
    auth: '/api/auth',
    music: '/api/music',
    content: '/api/content',
  };
  
  export const NAVIGATION_ITEMS = [
    {
      title: 'Music',
      items: [
        { title: 'Discover', href: '/music' },
        { title: '24/7 Music', href: '/music24' },
        { title: 'Lofi', href: '/lofi' },
        { title: 'Custom Songs', href: '/custom-song-generator' },
        { title: 'Song Creation', href: '/song-creation' },
        { title: 'Lofi Mix', href: '/lofi-mix' },
        { title: "Kid's Music", href: '/kids-music' },
      ],
    },
    {
      title: 'Content',
      items: [
        { title: '15s Reels', href: '/15-reel' },
        { title: 'Comedy Shows', href: '/comedy-show' },
        { title: '24h Shows', href: '/twenty-four-hour-show' },
        { title: 'Story Generation', href: '/story-generation' },
      ],
    },
  ];