"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLProps<HTMLDivElement> {
  src?: string
  alt?: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          {/* Optional fallback content */}
          {alt?.charAt(0)?.toUpperCase()}
        </div>
      )}
    </div>
  )
)

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, ...props }, ref) => (
    <div ref={ref} className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props}>
      {alt?.charAt(0)?.toUpperCase()}
    </div>
  )
)

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, src, alt, ...props }, ref) => (
    <img ref={ref} src={src} alt={alt} className={cn("aspect-square h-full w-full object-cover", className)} {...props} />
  )
)

AvatarFallback.displayName = "AvatarFallback"

Avatar.displayName = "Avatar"

export { Avatar, AvatarFallback, AvatarImage }
