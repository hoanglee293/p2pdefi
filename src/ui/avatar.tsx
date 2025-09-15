"use client"

import * as React from "react"
import Image from "next/image"
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
        <Image
          src={src}
          alt={alt || ""}
          width={40}
          height={40}
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
  ({ className, alt, ...props }, ref) => (
    <div ref={ref} className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props}>
      {alt?.charAt(0)?.toUpperCase()}
    </div>
  )
)

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, src, alt }) => (
    <Image 
      src={src || ""} 
      alt={alt || ""} 
      width={40} 
      height={40} 
      className={cn("aspect-square h-full w-full object-cover", className)} 
    />
  )
)
AvatarImage.displayName = "AvatarImage"

AvatarFallback.displayName = "AvatarFallback"

Avatar.displayName = "Avatar"

export { Avatar, AvatarFallback, AvatarImage }
