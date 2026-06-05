import { continueAsGuestAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

/** "Giriş yapmadan devam et" — guest cookie set edip home'a gider. */
export function GuestContinue({
  label = "Giriş yapmadan devam et.",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <form action={continueAsGuestAction} className="flex justify-center lg:justify-start">
      <button
        type="submit"
        className={cn(
          "text-body-sm font-semibold hover:underline",
          className ?? "text-ink-900",
        )}
      >
        {label}
      </button>
    </form>
  );
}
