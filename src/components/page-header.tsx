import * as React from "react"

import { cn } from "@/lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export function PageHeader({
  className,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <div className={cn("grid gap-1", className)} {...props}>
      {children}
    </div>
  )
}

interface PageHeaderHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode
}

export function PageHeaderHeading({
  className,
  children,
  ...props
}: PageHeaderHeadingProps) {
  return (
    <h1
      className={cn(
        "text-3xl font-bold tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

interface PageHeaderDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

export function PageHeaderDescription({
  className,
  children,
  ...props
}: PageHeaderDescriptionProps) {
  return (
    <p
      className={cn("text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  )
} 