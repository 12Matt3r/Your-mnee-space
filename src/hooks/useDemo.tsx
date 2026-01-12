// Re-export from DemoContext
export { useDemo } from '../contexts/DemoContext';

// useDemoContent hook - returns mock demo content
import { useState, useEffect } from 'react';

export function useDemoContent() {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading demo content
    const timer = setTimeout(() => {
      setContent([
        {
          id: 'demo-1',
          title: 'Electric Dreams',
          content_type: 'audio',
          file_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          view_count: 1520,
          like_count: 234,
          created_at: new Date().toISOString()
        },
        {
          id: 'demo-2',
          title: 'Neon Nights',
          content_type: 'audio',
          file_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
          view_count: 2340,
          like_count: 456,
          created_at: new Date().toISOString()
        }
      ]);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { content, loading };
}
