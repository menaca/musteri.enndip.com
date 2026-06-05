"use client";

import { useState } from "react";
import { ChevronRightIcon } from "@/components/ui/icons";
import type { CarModelPanelSpecDto } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/** Teknik özellikler — açılır/kapanır (Flutter panel-spec). */
export function PanelSpec({ spec }: { spec: CarModelPanelSpecDto | null }) {
  const [open, setOpen] = useState(false);
  if (!spec) return null;

  const rows: { label: string; value: string }[] = [];
  const push = (label: string, value: string | number | null | undefined) => {
    if (value !== null && value !== undefined && String(value).trim() !== "") {
      rows.push({ label, value: String(value) });
    }
  };
  push("Model yılı", spec.modelYear);
  push("Kasa tipi", spec.bodyStyle);
  push("Vites", spec.transmission);
  push("Çekiş", spec.driveType);
  push("Yakıt", spec.fuelType);
  if (spec.engineDisplacementCc) push("Motor hacmi", `${spec.engineDisplacementCc} cc`);
  if (spec.powerHp) push("Güç", `${spec.powerHp} HP`);
  if (spec.warrantyMonths) push("Garanti", `${spec.warrantyMonths} ay`);
  if (spec.serviceIntervalKm) push("Servis aralığı", `${spec.serviceIntervalKm} km`);

  const equipment = (spec.equipmentItems ?? []).map((e) =>
    typeof e === "string" ? e : e.label,
  );

  if (rows.length === 0 && equipment.length === 0) return null;

  return (
    <div className="rounded-3xl border border-line bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4"
      >
        <span className="text-heading-sm">Teknik özellikler</span>
        <ChevronRightIcon
          size={20}
          className={cn("text-muted transition-transform", open && "rotate-90")}
        />
      </button>

      {open && (
        <div className="px-5 pb-5">
          {rows.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
              {rows.map((r) => (
                <div key={r.label} className="flex flex-col">
                  <dt className="text-body-sm">{r.label}</dt>
                  <dd className="text-body-md font-semibold text-ink-900">{r.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {equipment.length > 0 && (
            <div className="mt-5">
              <p className="text-body-sm">Donanım</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {equipment.map((e, i) => (
                  <span
                    key={i}
                    className="rounded-pill border border-line bg-paper px-3 py-1.5 text-xs font-medium text-ink-900"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
