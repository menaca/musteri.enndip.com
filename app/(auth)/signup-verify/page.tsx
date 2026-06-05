import type { Metadata } from "next";
import { MailIcon } from "@/components/ui/icons";
import { SignupVerifyActions } from "@/components/auth/signup-verify-actions";

export const metadata: Metadata = { title: "E-postanı Doğrula" };

export default async function SignupVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-12 flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream text-ink-900">
          <MailIcon size={30} />
        </div>
        <h1 className="mt-6 text-display-md">Kayıt tamamlandı</h1>
        <p className="mt-3 max-w-sm text-body-md text-muted">
          {email ? (
            <>
              <span className="font-semibold text-ink-900">{email}</span> adresine bir
              doğrulama bağlantısı gönderdik. Hesabını etkinleştirmek için e-postandaki
              bağlantıya tıkla.
            </>
          ) : (
            "E-posta adresine bir doğrulama bağlantısı gönderdik. Hesabını etkinleştirmek için bağlantıya tıkla."
          )}
        </p>
      </div>

      <div className="mt-10">
        <SignupVerifyActions email={email ?? ""} />
      </div>
    </div>
  );
}
