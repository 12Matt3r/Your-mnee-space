// YourSpace Creative Labs - Header Component
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { 
  BellIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ThemeSelector } from '../theme/ThemeSelector'
import { ConnectWallet } from '../web3/ConnectWallet'

export const Header = () => {
  const { user, profile, signOut } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="h-20 bg-mnee-charcoal/80 backdrop-blur-xl border-b border-mnee-slate flex items-center justify-between px-6">
      {/* Left Section - MNEE Logo */}
      <div className="flex items-center space-x-4">
        {/* MNEE Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-mnee-gold to-mnee-blue flex items-center justify-center shadow-mnee-gold">
            <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28C15.5817 28 12 24.4183 12 20Z" fill="white"/>
              <circle cx="20" cy="20" r="5" fill="#0066FF"/>
            </svg>
          </div>
          <div className="hidden md:block">
            <span className="text-white font-bold text-lg">YourSpace</span>
            <span className="text-mnee-gold text-xs block -mt-1">Powered by MNEE</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-lg mx-8">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-mnee-gray" />
          <input
            type="text"
            placeholder="Search agents, creators, content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-mnee-slate border border-mnee-charcoal rounded-lg text-white placeholder-mnee-gray focus:outline-none focus:border-mnee-blue focus:ring-2 focus:ring-mnee-blue/20 transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {user ? (
          // Authenticated User Content
          <>
            {/* Quick Create Button */}
            <Link
              to="/create"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-mnee-gold to-mnee-goldDark rounded-lg text-mnee-black font-medium hover:shadow-mnee-gold transition-all duration-200"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Create</span>
            </Link>

            <ConnectWallet />

            <ThemeSelector />

            {/* Notifications */}
            <button className="relative p-2 text-mnee-gray hover:text-mnee-gold transition-colors">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-mnee-gold rounded-full"></span>
            </button>

            {/* User Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-mnee-slate transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-mnee-gold to-mnee-blue flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.display_name} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5 text-mnee-black" />
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">
                    {profile?.display_name || profile?.username || 'User'}
                  </p>
                  <p className="text-xs text-mnee-gray">
                    {profile?.subscription_tier || 'Free'}
                  </p>
                </div>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 bg-mnee-charcoal/95 backdrop-blur-xl border border-mnee-slate rounded-lg shadow-lg focus:outline-none">
                  <div className="p-2">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                            active ? 'bg-mnee-slate text-mnee-gold' : 'text-gray-300'
                          }`}
                        >
                          View Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/settings"
                          className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                            active ? 'bg-mnee-slate text-mnee-gold' : 'text-gray-300'
                          }`}
                        >
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/studio"
                          className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                            active ? 'bg-mnee-slate text-mnee-gold' : 'text-gray-300'
                          }`}
                        >
                          Creator Studio
                        </Link>
                      )}
                    </Menu.Item>
                    <hr className="my-2 border-mnee-slate" />
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={signOut}
                          className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            active ? 'bg-red-500/20 text-red-400' : 'text-gray-300'
                          }`}
                        >
                          Sign Out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </>
        ) : (
          // Guest User Content
          <>
            <div className="text-sm text-mnee-gray hidden md:block">
              Sign up to create agents
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 text-mnee-gray hover:text-white transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-gradient-to-r from-mnee-gold to-mnee-goldDark rounded-lg text-mnee-black font-medium hover:shadow-mnee-gold transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
