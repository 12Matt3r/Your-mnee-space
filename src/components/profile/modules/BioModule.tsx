import React from 'react'
import { PencilIcon } from '@heroicons/react/24/outline'

interface BioModuleProps {
  content?: string
  editable?: boolean
  onEdit?: () => void
}

export const BioModule: React.FC<BioModuleProps> = ({ content, editable, onEdit }) => {
  return (
    <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 relative group">
      {editable && (
        <button
          onClick={onEdit}
          className="absolute top-4 right-4 p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-300 opacity-0 group-hover:opacity-100 transition-all"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
      )}
      <h3 className="text-xl font-bold text-white mb-4">About Me</h3>
      <div className="prose prose-invert max-w-none text-gray-300">
        {content || "No bio yet."}
      </div>
    </div>
  )
}
