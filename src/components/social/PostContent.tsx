import React from 'react';
import { Link } from 'react-router-dom';

const PostContent = ({ text }: { text: string }) => {
  // Simple regex to find hashtags and images markdown
  // Very basic parser for demo purposes
  const parts = text.split(/(#[a-zA-Z0-9_]+|!\[.*?\]\(.*?\))/g);

  const isValidImageUrl = (url: string) => {
    if (!url) return false;
    try {
      // Validate protocol is http or https
      const parsed = new URL(url, 'http://dummy.com');
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="text-gray-900 dark:text-white text-base leading-relaxed whitespace-pre-wrap">
      {parts.map((part, index) => {
        if (part.startsWith('#')) {
          const tag = part.substring(1); // remove #
          return (
            <Link key={index} to={`/discover?q=${tag}`} className="text-blue-500 hover:underline cursor-pointer">
              {part}
            </Link>
          );
        } else if (part.match(/!\[.*?\]\(.*?\)/)) {
            // Render markdown image
            const match = part.match(/!\[(.*?)\]\((.*?)\)/);
            if (match && isValidImageUrl(match[2])) {
                return (
                    <img
                        key={index}
                        src={match[2]}
                        alt={match[1]}
                        className="mt-3 rounded-xl w-full object-cover max-h-96"
                    />
                );
            } else if (match) {
                // Invalid URL
                return <span key={index} className="text-red-500 text-xs">[Invalid Image URL]</span>;
            }
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};

export default PostContent;
