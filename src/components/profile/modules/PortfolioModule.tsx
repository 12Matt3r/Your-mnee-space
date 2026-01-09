import React from 'react'
import { Link } from 'react-router-dom'
import { EyeIcon, HeartIcon } from '@heroicons/react/24/outline'

interface PortfolioModuleProps {
  items: any[]
  limit?: number
}

export const PortfolioModule: React.FC<PortfolioModuleProps> = ({ items, limit = 6 }) => {
  const displayItems = items.slice(0, limit)

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Portfolio</h3>

      {displayItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayItems.map((item) => (
            <Link
              key={item.id}
              to={`/content/${item.id}`}
              className="group relative aspect-square rounded-lg overflow-hidden border border-purple-500/10 hover:border-purple-500/40 transition-all"
            >
              {item.file_url ? (
                <img
                  src={item.file_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-black flex items-center justify-center">
                  <span className="text-purple-400 text-xs uppercase font-bold tracking-wider">
                    {item.content_type}
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h4 className="text-white font-medium text-sm truncate">{item.title}</h4>
                <div className="flex items-center justify-between text-xs text-gray-300 mt-1">
                  <span className="flex items-center"><EyeIcon className="h-3 w-3 mr-1" />{item.view_count || 0}</span>
                  <span className="flex items-center"><HeartIcon className="h-3 w-3 mr-1" />{item.like_count || 0}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No items in portfolio yet.
        </div>
      )}
    </div>
  )
}
