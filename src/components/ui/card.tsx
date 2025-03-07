import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva("", {
  variants: {
    variant: {
      default: "rounded-lg border bg-card text-card-foreground shadow-sm",
      blurry:
        "rounded-xl border bg-card/40 text-card-foreground backdrop-blur-[2px] shadow-sm transition-all duration-300 overflow-hidden relative isolate before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-primary/[0.02] before:via-transparent before:to-primary/[0.02] before:opacity-0 before:transition-all before:duration-500 group-hover:before:opacity-100 after:absolute after:inset-0 after:-z-10 after:bg-gradient-to-br after:from-background/30 after:via-transparent after:to-background/30 after:opacity-100 after:transition-all after:duration-500 group-hover:after:opacity-0",
    },
  },
  defaultVariants: {
    variant: "blurry",
  },
});

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant }), className)}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 relative z-10", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-6 pt-0 relative z-[1]  flex flex-col justify-between",
      "after:absolute after:inset-0 after:-z-10 after:bg-gradient-to-br after:from-primary/[0.03] after:to-transparent after:opacity-0 after:transition-opacity after:duration-500 group-hover:after:opacity-100",
      className
    )}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 relative z-10", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
