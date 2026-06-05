import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

type Variant = "primary" | "ghost";

type CommonProps = {
  variant?: Variant;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
};

function classesFor(variant: Variant, fullWidth?: boolean) {
  return cn(
    variant === "primary" ? "btn-primary" : "btn-ghost",
    fullWidth && "w-full",
  );
}

/** Siyah pill buton (Flutter AppPrimaryButton karşılığı). */
export function AppButton({
  variant = "primary",
  isLoading = false,
  fullWidth,
  children,
  className,
  disabled,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(classesFor(variant, fullWidth), className)}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <Spinner size={18} className={variant === "primary" ? "text-paper" : "text-ink-900"} />
      )}
      {children}
    </button>
  );
}

/** Link görünümlü pill buton. */
export function AppLinkButton({
  href,
  variant = "primary",
  fullWidth,
  children,
  className,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={cn(classesFor(variant, fullWidth), className)}>
      {children}
    </Link>
  );
}
