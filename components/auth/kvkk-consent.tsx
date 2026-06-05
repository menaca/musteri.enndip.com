"use client";

import { CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/** KVKK onay kutusu (zorunlu). */
export function KvkkConsent({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 select-none">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
          checked ? "border-ink-900 bg-ink-900 text-paper" : "border-line-strong bg-paper",
        )}
      >
        {checked && <CheckIcon size={14} />}
      </button>
      <span className="text-body-sm text-muted">
        Kişisel verilerimin işlenmesine ilişkin{" "}
        <span className="font-semibold text-ink-900">KVKK Aydınlatma Metni</span>&apos;ni
        okudum ve onaylıyorum.
      </span>
    </label>
  );
}
