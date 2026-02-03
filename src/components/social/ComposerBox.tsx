import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageIcon, Smile, Calendar, MapPin, BarChart2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { socialApi } from '../../lib/api';
import { Button } from '../ui/button';

const ComposerBox = () => {
  const [postText, setPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [mockImage, setMockImage] = useState<string | null>(null);
  const { user, profile } = useAuth();
  const maxChars = 280;

  const charCount = postText.length;
  const remainingChars = maxChars - charCount;
  const progress = Math.min((charCount / maxChars) * 100, 100);
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (progress / 100) * circumference;

  const getProgressColor = () => {
    if (remainingChars < 0) return 'text-red-500';
    if (remainingChars <= 20) return 'text-yellow-500';
    return 'text-blue-500';
  };

  const handleImageUpload = () => {
      // Mock image upload
      const randomImage = `https://picsum.photos/seed/${Date.now()}/800/400`;
      setMockImage(randomImage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!postText.trim() && !mockImage) || postText.length > maxChars || !user) return;

    setIsPosting(true);
    try {
      // In a real app, we'd upload the image to storage and pass the URL
      // For now, we append the mock image URL to content if it exists to simulate it
      const content = mockImage ? `${postText}\n\n![Image](${mockImage})` : postText;

      await socialApi.createPost(content);
      setPostText('');
      setMockImage(null);
      // Trigger a refresh of the timeline
      window.dispatchEvent(new CustomEvent('refreshTimeline'));
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  if (!user) {
    return (
      <div className="border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Sign in to share your creative thoughts</p>
          <Link
            to="/login"
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-b border-gray-200 dark:border-gray-800 p-4">
      <div className="flex space-x-4">
        <img
          src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || user.email || 'User')}&background=6366f1&color=fff`}
          alt="Your avatar"
          className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700"
        />
        <div className="flex-1">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's happening in your creative world?"
            aria-label="What's happening in your creative world?"
            className="w-full text-xl placeholder-gray-500 bg-transparent text-gray-900 dark:text-white resize-none border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-2 -ml-2 transition-all"
            rows={3}
            maxLength={maxChars}
            disabled={isPosting}
          />

          {mockImage && (
              <div className="relative mt-4 rounded-xl overflow-hidden group">
                  <img src={mockImage} alt="Upload preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => setMockImage(null)}
                    aria-label="Remove image"
                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
              </div>
          )}

          {/* Composer Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleImageUpload}
                aria-label="Add image"
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                title="Add Image"
              >
                <ImageIcon className="w-5 h-5 text-blue-500" />
              </button>
              <button
                type="button"
                aria-label="Add poll"
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                title="Add Poll"
              >
                <BarChart2 className="w-5 h-5 text-blue-500" />
              </button>
              <button
                type="button"
                aria-label="Add emoji"
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                title="Add Emoji"
              >
                <Smile className="w-5 h-5 text-blue-500" />
              </button>
              <button
                type="button"
                aria-label="Schedule post"
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                title="Schedule"
              >
                <Calendar className="w-5 h-5 text-blue-500" />
              </button>
              <button
                type="button"
                aria-label="Add location"
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                title="Add Location"
              >
                <MapPin className="w-5 h-5 text-blue-500" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {/* Character Count Ring */}
                {postText.length > 0 && (
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="16"
                        cy="16"
                        r={radius}
                        fill="none"
                        className="stroke-gray-200 dark:stroke-gray-700"
                        strokeWidth="2"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r={radius}
                        fill="none"
                        className={`transition-all duration-300 ease-in-out ${getProgressColor()}`}
                        strokeWidth="2"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashoffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    {remainingChars <= 20 && (
                      <span
                        className={`absolute text-xs font-medium ${remainingChars < 0 ? 'text-red-500' : 'text-gray-500'}`}
                        role="status"
                        aria-live="polite"
                      >
                        {remainingChars}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={!postText.trim() && !mockImage}
                isLoading={isPosting}
                loadingText="Posting..."
                className="bg-blue-500 hover:bg-blue-600 rounded-full bg-none"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ComposerBox;
