// YourSpace MNEE - Creator Marketplace with MNEE Payments
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { MNEE_CONFIG, generatePaymentLink, SUBSCRIPTION_TIERS, AI_CREDIT_PRICING } from '../../lib/mnee'
import { 
  UserIcon,
  StarIcon,
  MusicalNoteIcon,
  PaintBrushIcon,
  CodeBracketIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  CheckIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Creator {
  id: string
  user_id: string
  creator_type: string
  total_subscribers: number
  total_earnings_mnee: string
  tip_jar_enabled: boolean
  subscription_enabled: boolean
  subscription_price_mnee: string | null
  payout_address: string | null
}

// Sample content items with MNEE pricing
const creatorContent = [
  {
    id: '1',
    title: 'Synthwave Album - Neon Dreams',
    type: 'music',
    creator: 'NeonArtist',
    price: 15,
    description: 'Full album with 12 original synthwave tracks',
    subscribers: 150,
    rating: 4.9
  },
  {
    id: '2', 
    title: 'Digital Art Collection - Cyber Visions',
    type: 'art',
    creator: 'ZenCreator',
    price: 25,
    description: '20 high-res cyberpunk artworks',
    subscribers: 85,
    rating: 4.8
  },
  {
    id: '3',
    title: 'React Component Library',
    type: 'code',
    creator: 'CodeMaster',
    price: 50,
    description: 'Production-ready UI components with TypeScript',
    subscribers: 234,
    rating: 4.7
  },
  {
    id: '4',
    title: 'Lo-Fi Beats Pack',
    type: 'music',
    creator: 'ChillBeats',
    price: 10,
    description: '30 royalty-free lo-fi loops and samples',
    subscribers: 412,
    rating: 4.9
  },
  {
    id: '5',
    title: 'Anime Character Designs',
    type: 'art',
    creator: 'AnimeStudio',
    price: 35,
    description: 'Custom anime-style character design service',
    subscribers: 178,
    rating: 4.6
  },
  {
    id: '6',
    title: 'Smart Contract Templates',
    type: 'code',
    creator: 'Web3Dev',
    price: 75,
    description: 'Audited Solidity templates for NFT and DeFi projects',
    subscribers: 89,
    rating: 4.8
  }
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'music': return MusicalNoteIcon
    case 'art': return PaintBrushIcon
    case 'code': return CodeBracketIcon
    default: return SparklesIcon
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'music': return 'from-pink-500 to-purple-500'
    case 'art': return 'from-cyan-500 to-blue-500'
    case 'code': return 'from-green-500 to-emerald-500'
    default: return 'from-purple-500 to-pink-500'
  }
}

export const MarketplacePage = () => {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'content' | 'subscriptions' | 'ai-credits'>('content')
  const [filterType, setFilterType] = useState('all')
  const [showTipModal, setShowTipModal] = useState(false)
  const [tipAmount, setTipAmount] = useState('5')
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null)

  useEffect(() => {
    loadCreators()
  }, [])

  const loadCreators = async () => {
    try {
      const { data, error } = await supabase
        .from('creators')
        .select('*')
      
      if (!error && data) {
        setCreators(data)
      }
    } catch (err) {
      console.log('Error loading creators:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTip = (creatorAddress: string) => {
    setSelectedCreator(creatorAddress)
    setShowTipModal(true)
  }

  const confirmTip = () => {
    if (!selectedCreator) return
    const paymentUrl = generatePaymentLink(selectedCreator, tipAmount)
    window.open(paymentUrl, '_blank')
    setShowTipModal(false)
    toast.success('Opening MNEE payment portal...')
  }

  const handleSubscribe = (tierPrice: number, creatorAddress: string) => {
    const paymentUrl = generatePaymentLink(creatorAddress || MNEE_CONFIG.address, tierPrice.toString())
    window.open(paymentUrl, '_blank')
    toast.success('Opening MNEE payment portal for subscription...')
  }

  const handlePurchase = (price: number) => {
    const paymentUrl = generatePaymentLink(MNEE_CONFIG.address, price.toString())
    window.open(paymentUrl, '_blank')
    toast.success('Opening MNEE payment portal...')
  }

  const filteredContent = filterType === 'all' 
    ? creatorContent 
    : creatorContent.filter(c => c.type === filterType)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Creator Marketplace
          </h1>
          <p className="text-gray-400 text-lg">
            Support creators with MNEE - Music, Art, Code, and more
          </p>
          <p className="text-sm text-purple-400 mt-2">
            1 MNEE = $1 USD | Contract: {MNEE_CONFIG.address.slice(0, 10)}...
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-700 pb-4 justify-center">
          <button
            onClick={() => setSelectedTab('content')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
              selectedTab === 'content' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <SparklesIcon className="w-5 h-5" />
            Creator Content
          </button>
          <button
            onClick={() => setSelectedTab('subscriptions')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
              selectedTab === 'subscriptions' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            Subscription Tiers
          </button>
          <button
            onClick={() => setSelectedTab('ai-credits')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
              selectedTab === 'ai-credits' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <CpuChipIcon className="w-5 h-5" />
            AI Credits
          </button>
        </div>

        {/* Content Tab */}
        {selectedTab === 'content' && (
          <div>
            {/* Filters */}
            <div className="flex gap-2 mb-6 justify-center">
              {['all', 'music', 'art', 'code'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all ${
                    filterType === type 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map(item => {
                const Icon = getTypeIcon(item.type)
                return (
                  <div
                    key={item.id}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500 transition-all"
                  >
                    <div className={`h-32 bg-gradient-to-br ${getTypeColor(item.type)} flex items-center justify-center`}>
                      <Icon className="w-16 h-16 text-white/80" />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <StarIcon className="w-4 h-4 fill-current" />
                          <span className="text-sm">{item.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <UserIcon className="w-4 h-4" />
                        <span>by {item.creator}</span>
                        <span className="text-purple-400">| {item.subscribers} subscribers</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                        <div>
                          <span className="text-2xl font-bold text-green-400">{item.price} MNEE</span>
                          <span className="text-xs text-gray-500 ml-1">(~${item.price} USD)</span>
                        </div>
                        <button 
                          onClick={() => handlePurchase(item.price)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Subscription Tiers Tab */}
        {selectedTab === 'subscriptions' && (
          <div>
            <p className="text-center text-gray-400 mb-8">
              Subscribe to your favorite creators with monthly MNEE payments
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => (
                <div
                  key={key}
                  className={`bg-gray-800/50 border rounded-xl p-6 text-center ${
                    key === 'pro' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-gray-700'
                  }`}
                >
                  {key === 'pro' && (
                    <div className="text-xs text-purple-400 font-semibold mb-2 uppercase">Most Popular</div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-green-400">{tier.price}</span>
                    <span className="text-gray-400"> MNEE/mo</span>
                    {tier.price > 0 && (
                      <div className="text-xs text-gray-500">(~${tier.price} USD/mo)</div>
                    )}
                  </div>
                  
                  <ul className="text-left space-y-2 mb-6">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300">
                        <CheckIcon className="w-5 h-5 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => tier.price > 0 && handleSubscribe(tier.price, MNEE_CONFIG.address)}
                    disabled={tier.price === 0}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      tier.price === 0
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
                    }`}
                  >
                    {tier.price === 0 ? 'Current Plan' : 'Subscribe'}
                  </button>
                </div>
              ))}
            </div>
            
            {/* Creator Tip Jars */}
            {creators.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-center mb-6">Creator Tip Jars</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {creators.filter(c => c.tip_jar_enabled).map(creator => (
                    <div key={creator.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{creator.creator_type} Creator</div>
                        <div className="text-sm text-gray-400">{creator.total_subscribers} subscribers</div>
                      </div>
                      <button
                        onClick={() => handleTip(creator.payout_address || MNEE_CONFIG.address)}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg font-semibold hover:from-yellow-400 hover:to-orange-400"
                      >
                        <CurrencyDollarIcon className="w-5 h-5 inline mr-1" />
                        Tip
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Credits Tab */}
        {selectedTab === 'ai-credits' && (
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-gray-400 mb-8">
              Use MNEE to power AI-generated content on YourSpace
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(AI_CREDIT_PRICING).map(([key, pricing]) => (
                <div key={key} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <CpuChipIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{pricing.description}</h3>
                  <div className="text-3xl font-bold text-green-400 mb-1">{pricing.cost} MNEE</div>
                  <div className="text-sm text-gray-400 mb-4">{pricing.unit}</div>
                  <div className="text-xs text-gray-500">(~${pricing.cost} USD)</div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-6">
              <h4 className="text-xl font-bold mb-4 text-center">How AI Credits Work</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>Credits are deducted automatically when you use AI features</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>Generate images, write content, or create designs with AI</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>All payments in MNEE - stable value ($1 USD = 1 MNEE)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>Premium subscribers get 20% discount on AI credits</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowTipModal(false)}>
          <div className="bg-gray-800 p-8 rounded-2xl max-w-md w-full mx-4 border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">Send a Tip</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Tip Amount (MNEE)</label>
              <input
                type="number"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                min="1"
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg"
              />
              <p className="text-sm text-gray-400 mt-1">~${tipAmount} USD</p>
            </div>
            
            <div className="flex gap-2 mb-6">
              {[5, 10, 25, 50].map(amount => (
                <button
                  key={amount}
                  onClick={() => setTipAmount(amount.toString())}
                  className={`flex-1 py-2 rounded-lg ${
                    tipAmount === amount.toString() 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>
            
            <button
              onClick={confirmTip}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg font-bold hover:from-yellow-400 hover:to-orange-400 transition-all"
            >
              Send {tipAmount} MNEE Tip
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
