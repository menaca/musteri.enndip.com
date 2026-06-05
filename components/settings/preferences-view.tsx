"use client";

import { useEffect, useState } from "react";
import { SettingsGroup, SettingsTile } from "@/components/ui/settings-tile";
import { Toggle } from "@/components/ui/toggle";

interface Prefs {
  marketingEmails: boolean;
  smsUpdates: boolean;
  priceAlerts: boolean;
  bidUpdates: boolean;
  listingExpiry: boolean;
  promotions: boolean;
}

const DEFAULTS: Prefs = {
  marketingEmails: true,
  smsUpdates: true,
  priceAlerts: true,
  bidUpdates: true,
  listingExpiry: true,
  promotions: true,
};

const STORAGE_KEY = "enndip_prefs";

export function PreferencesView() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<Prefs>) });
    } catch {
      // yoksay
    }
    setLoaded(true);
  }, []);

  function update<K extends keyof Prefs>(key: K, value: Prefs[K]) {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // yoksay
      }
      return next;
    });
  }

  const sw = (key: keyof Prefs) => (
    <Toggle checked={prefs[key]} onChange={(v) => update(key, v)} />
  );

  return (
    <div className={loaded ? "flex flex-col gap-6 transition-opacity" : "flex flex-col gap-6 opacity-0"}>
      <SettingsGroup title="İletişim">
        <SettingsTile
          title="Kampanya e-postaları"
          subtitle="Yeni marka ve fırsat duyuruları"
          trailing={sw("marketingEmails")}
        />
        <SettingsTile
          title="SMS güncellemeleri"
          subtitle="Kritik ilan durumu mesajları"
          trailing={sw("smsUpdates")}
        />
      </SettingsGroup>

      <SettingsGroup title="Fiyat">
        <SettingsTile
          title="Fiyat uyarıları"
          subtitle="Benzer araçlarda yeni teklif bildirimi"
          trailing={sw("priceAlerts")}
        />
      </SettingsGroup>

      <SettingsGroup title="Bildirim ayarları">
        <SettingsTile
          title="Yeni teklifler"
          subtitle="Bayiler teklif verdiğinde bildirim"
          trailing={sw("bidUpdates")}
        />
        <SettingsTile
          title="Süre hatırlatması"
          subtitle="İlan süren dolmadan önce"
          trailing={sw("listingExpiry")}
        />
        <SettingsTile
          title="Kampanyalar"
          subtitle="Özel fırsat ve etkinlikler"
          trailing={sw("promotions")}
        />
      </SettingsGroup>
    </div>
  );
}
