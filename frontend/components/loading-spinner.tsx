import { cn } from "@/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ className, size = "md", ...props }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Alternative loading animation
export function LoadingDots({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("loading-dots", className)} {...props}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

// Pulse loading animation
export function LoadingPulse({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "w-full h-32 bg-muted rounded-lg animate-pulse", 
        className
      )} 
      {...props} 
    />
  )
}

// Shimmer loading effect
export function LoadingShimmer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-muted rounded-lg",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-shimmer before:bg-gradient-to-r", 
        "before:from-transparent before:via-white/10 before:to-transparent",
        className
      )} 
      {...props} 
    />
  )
}
