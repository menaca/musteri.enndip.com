import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsGroup, SettingsTile } from "@/components/ui/settings-tile";
import { MailIcon, PhoneIcon, GlobeIcon } from "@/components/ui/icons";

export const metadata: Metadata = { title: "İletişim" };

const EMAIL = "destek@enndip.com";
const PHONE = "+90 850 000 00 00";
const WEB = "https://enndip.com";

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader title="İletişim" subtitle="Soruların için bize ulaş." />

      <p className="mb-6 text-body-md text-muted">
        Müşteri destek ekibimiz hafta içi 09:00–18:00 arasında yanıt verir.
      </p>

      <SettingsGroup title="Kanallar">
        <SettingsTile
          title="E-posta"
          subtitle={EMAIL}
          leading={<MailIcon size={22} />}
          href={`mailto:${EMAIL}`}
        />
        <SettingsTile
          title="Telefon"
          subtitle={PHONE}
          leading={<PhoneIcon size={22} />}
          href={`tel:${PHONE.replace(/\s/g, "")}`}
        />
        <SettingsTile
          title="Web sitesi"
          subtitle={WEB}
          leading={<GlobeIcon size={22} />}
          href={WEB}
        />
      </SettingsGroup>
    </div>
  );
}
