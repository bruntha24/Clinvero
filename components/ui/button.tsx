import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-teal-500 focus-visible:ring-teal-500/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-teal-600 text-white hover:bg-teal-700",
        outline: "border border-teal-600 text-teal-700 hover:bg-teal-50",
        ghost: "hover:bg-teal-50 text-teal-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        default: "h-14 px-5 text-lg",       // taller height, reduced width via smaller padding
        sm: "h-12 px-4 text-base",
        lg: "h-16 px-6 text-xl",
        icon: "h-14 w-14",
        "icon-sm": "h-12 w-12",
        "icon-lg": "h-16 w-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }