// YourSpace Creative Labs - Button Component
import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'default' | 'lg' | 'circle'
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, loadingText, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      default: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl',
      outline: 'border border-purple-500/50 text-purple-300 bg-black/20 backdrop-blur-sm hover:bg-purple-500/10 hover:border-purple-400',
      ghost: 'text-purple-300 hover:bg-purple-500/10 hover:text-purple-200',
      destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
    }
    
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      default: 'h-10 px-4 py-2',
      lg: 'h-12 px-6 text-lg',
      circle: 'h-12 w-12 rounded-full p-0'
    }
    
    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading && loadingText ? loadingText : children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }