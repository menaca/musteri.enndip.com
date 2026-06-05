"use client";

import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "./icons";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
  /** Şifre alanı için göster/gizle düğmesi ekler. */
  password?: boolean;
};

/** Flutter AuthTextField karşılığı — etiket + hata + şifre toggle. */
export const AppTextField = forwardRef<HTMLInputElement, Props>(function AppTextField(
  { label, error, password, type, className, id, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const [show, setShow] = useState(false);
  const resolvedType = password ? (show ? "text" : "password") : type;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={fieldId} className="mb-1.5 block text-label text-ink-900">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={fieldId}
          type={resolvedType}
          className={cn(
            "field-input",
            password && "pr-12",
            error && "border-danger focus:border-danger focus:ring-danger/10",
            className,
          )}
          aria-invalid={!!error}
          {...rest}
        />
        {password && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-3 flex items-center text-muted hover:text-ink-900"
            aria-label={show ? "Şifreyi gizle" : "Şifreyi göster"}
            tabIndex={-1}
          >
            {show ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
});
