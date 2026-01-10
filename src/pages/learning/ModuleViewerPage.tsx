import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeftIcon,
  PlayIcon,
  CheckCircleIcon,
  ChatBubbleBottomCenterTextIcon,
  SparklesIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const mockLesson = {
  id: 1,
  title: 'Introduction to Vibe Coding',
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
  description: 'Learn the fundamentals of creating atmospheric digital spaces.',
  steps: [
    { id: 1, title: 'Understanding Atmosphere', completed: true },
    { id: 2, title: 'Color Theory for Mood', completed: false },
    { id: 3, title: 'Lighting Basics', completed: false },
    { id: 4, title: 'Interactive Elements', completed: false }
  ]
}

export const ModuleViewerPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'content' | 'ai'>('content')
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: "Hi! I'm your AI Tutor. I can help you understand Vibe Coding concepts. What would you like to know?" }
  ])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const newHistory = [...chatHistory, { role: 'user', content: chatInput }]
    setChatHistory(newHistory)
    setChatInput('')

    // Mock AI response
    setTimeout(() => {
      setChatHistory([
        ...newHistory,
        { role: 'ai', content: "That's a great question! In Vibe Coding, we focus on the emotional impact of the environment first. Try adjusting the ambient lighting color to see how it shifts the mood." }
      ])
    }, 1000)
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row bg-black/20">
      {/* Left Sidebar - Navigation */}
      <div className="w-full md:w-80 bg-black/40 border-r border-purple-500/20 flex flex-col">
        <div className="p-4 border-b border-purple-500/20">
          <button
            onClick={() => navigate('/learning')}
            className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Labs
          </button>
          <h2 className="text-lg font-bold text-white leading-tight">{mockLesson.title}</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {mockLesson.steps.map((step, index) => (
            <div
              key={step.id}
              className={`p-3 rounded-lg border flex items-center space-x-3 cursor-pointer transition-all ${
                index === 1 ? 'bg-purple-500/20 border-purple-500/50' : 'bg-black/20 border-transparent hover:bg-white/5'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                step.completed ? 'bg-green-500 border-green-500' : 'border-gray-500'
              }`}>
                {step.completed && <CheckCircleIcon className="h-4 w-4 text-white" />}
                {!step.completed && <span className="text-xs text-gray-400">{index + 1}</span>}
              </div>
              <span className={`text-sm ${index === 1 ? 'text-white font-medium' : 'text-gray-400'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Content/AI Toggle (Mobile only) */}
        <div className="md:hidden flex border-b border-purple-500/20">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'content' ? 'text-purple-300 border-b-2 border-purple-500' : 'text-gray-400'}`}
          >
            Lesson
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'ai' ? 'text-purple-300 border-b-2 border-purple-500' : 'text-gray-400'}`}
          >
            AI Tutor
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Video/Lesson Content */}
          <div className={`flex-1 overflow-y-auto p-6 ${activeTab === 'ai' ? 'hidden md:block' : 'block'}`}>
            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6 border border-purple-500/20 shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src={mockLesson.videoUrl}
                title="Lesson Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="prose prose-invert max-w-none">
              <h1 className="text-2xl font-bold text-white mb-4">{mockLesson.title}</h1>
              <p className="text-gray-300">{mockLesson.description}</p>
              <h3>Key Concepts</h3>
              <ul>
                <li>Color Psychology in Digital Spaces</li>
                <li>Audio-Visual Sync</li>
                <li>User Interaction Loops</li>
              </ul>

              <div className="mt-8 pt-8 border-t border-purple-500/20">
                <button
                  onClick={() => toast('XP Awarded! +100 XP', { icon: '🏆', style: { background: '#333', color: '#fff' } })}
                  className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-white font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center justify-center space-x-2"
                >
                  <TrophyIcon className="h-6 w-6" />
                  <span>Complete Lesson & Claim XP</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Tutor Panel (Right Side) */}
          <div className={`w-full md:w-96 bg-black/60 border-l border-purple-500/20 flex flex-col ${activeTab === 'content' ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-purple-500/20 bg-black/40 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <SparklesIcon className="h-5 w-5 text-purple-400" />
                <span className="font-bold text-white">AI Tutor</span>
              </div>
              <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Online</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-none'
                      : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-purple-500/20 bg-black/40">
              <form onSubmit={handleSendMessage} className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about the lesson..."
                  className="w-full pl-4 pr-10 py-3 bg-black/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-purple-500 hover:bg-purple-600 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChatBubbleBottomCenterTextIcon className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
