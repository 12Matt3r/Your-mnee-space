import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AcademicCapIcon,
  BeakerIcon,
  PlayCircleIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const learningPaths = [
  {
    id: 1,
    title: 'Vibe Coding 101',
    description: 'Master the art of atmospheric design and room customization.',
    icon: SparklesIcon,
    color: 'from-purple-500 to-pink-500',
    lessons: 12,
    students: 1205
  },
  {
    id: 2,
    title: '3D Room Architecture',
    description: 'Learn to build immersive virtual spaces from scratch.',
    icon: BeakerIcon,
    color: 'from-blue-500 to-cyan-500',
    lessons: 8,
    students: 850
  },
  {
    id: 3,
    title: 'Digital Music Production',
    description: 'Create beats and soundscapes for the metaverse.',
    icon: PlayCircleIcon,
    color: 'from-orange-500 to-red-500',
    lessons: 15,
    students: 2300
  }
]

const featuredMentors = [
  {
    id: 1,
    name: 'Alex Rivera',
    role: 'Vibe Architect',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    specialty: 'Room Design'
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Sound Designer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    specialty: 'Audio Engineering'
  },
  {
    id: 3,
    name: 'Marcus Johnson',
    role: '3D Modeler',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    specialty: 'Blender & Unity'
  }
]

export const LearningPage = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 p-8 md:p-12">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 border border-white/20">
            <SparklesIcon className="h-4 w-4 text-yellow-300" />
            <span className="text-sm font-medium text-white">Interactive Creative Labs</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Learn, Create, and <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
              Grow Together
            </span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-xl">
            Master new skills with interactive tutorials, join live workshops, and book 1:1 sessions with industry pros.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-white text-purple-900 font-bold rounded-xl hover:bg-gray-100 transition-colors">
              Explore Courses
            </button>
            <button className="px-6 py-3 bg-purple-500/30 text-white font-bold rounded-xl border border-purple-400/30 hover:bg-purple-500/40 transition-colors">
              Find a Mentor
            </button>
          </div>
        </div>

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Learning Paths */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <AcademicCapIcon className="h-6 w-6 text-cyan-400 mr-2" />
            Featured Paths
          </h2>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">View All</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {learningPaths.map((path) => (
            <div
              key={path.id}
              className="group relative bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-purple-500/25`}>
                <path.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{path.title}</h3>
              <p className="text-gray-400 text-sm mb-4 min-h-[40px]">
                {path.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center">
                  <PlayCircleIcon className="h-4 w-4 mr-1" />
                  {path.lessons} Lessons
                </span>
                <span className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  {path.students.toLocaleString()} Students
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Mentors */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <UserGroupIcon className="h-6 w-6 text-pink-400 mr-2" />
            Top Mentors
          </h2>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">Find More</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="flex items-center space-x-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/30"
              />
              <div>
                <h4 className="text-white font-bold">{mentor.name}</h4>
                <p className="text-purple-300 text-sm">{mentor.role}</p>
                <p className="text-gray-500 text-xs mt-1">{mentor.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
