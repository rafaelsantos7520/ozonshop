"use client"

import * as React from "react"
import Link, { type LinkProps } from "next/link"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

type AnchorAttrs = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "children"
>

export interface ButtonLinkProps
  extends Omit<LinkProps, "children">,
    AnchorAttrs,
    VariantProps<typeof buttonVariants> {
  newTab?: boolean
  children?: React.ReactNode
}

export function ButtonLink({
  href,
  prefetch,
  className,
  variant,
  size,
  newTab,
  children,
  ...rest
}: ButtonLinkProps) {
  const rel = newTab
    ? [rest.rel, "noopener", "noreferrer"].filter(Boolean).join(" ")
    : rest.rel

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={cn(buttonVariants({ variant, size, className }))}
      {...rest}
      target={newTab ? "_blank" : rest.target}
      rel={rel}
      data-slot="button"
    >
      {children}
    </Link>
  )
}

export default ButtonLink
