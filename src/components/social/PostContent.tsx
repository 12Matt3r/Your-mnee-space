import React from 'react';
import { Link } from 'react-router-dom';

const PostContent = ({ text }: { text: string }) => {
  // Simple regex to find hashtags and images markdown
  // Very basic parser for demo purposes
  const parts = text.split(/(#[a-zA-Z0-9_]+|!\[.*?\]\(.*?\))/g);

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
            if (match) {
                const src = match[2];
                // Security: Only allow http/https protocols to prevent XSS and other attacks
                if (src.startsWith('http://') || src.startsWith('https://')) {
                    return (
                        <img
                            key={index}
                            src={src}
                            alt={match[1]}
                            className="mt-3 rounded-xl w-full object-cover max-h-96"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                        />
                    );
                }
            }
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};

export default PostContent;
