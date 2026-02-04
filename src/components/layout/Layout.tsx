// YourSpace Creative Labs - Main Layout Component
import { ReactNode, Suspense } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { FloatingBuyMNEE } from '../mnee/BuyMNEEButton'
import { PageLoader } from '../ui/PageLoader'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-mnee-black relative overflow-hidden">
      {/* Subtle background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-matte pointer-events-none"></div>
      
      {/* Gold accent glow at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mnee-gold to-transparent opacity-30"></div>
      
      <div className="flex relative z-10">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <Suspense fallback={<PageLoader />}>
                {children}
              </Suspense>
            </div>
          </main>
        </div>
      </div>
      
      {/* Floating Buy MNEE button - always visible */}
      <FloatingBuyMNEE />
    </div>
  )
}
