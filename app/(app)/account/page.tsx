import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/ui/avatar";
import { AccountForm } from "@/components/account/account-form";
import { getMyProfile } from "@/lib/api/queries";
import type { UserProfileDto } from "@/lib/api/types";

export const metadata: Metadata = { title: "Hesabım" };

const ROLE_LABEL: Record<string, string> = {
  user: "Bireysel üye",
  dealer: "Bayi",
  admin: "Yönetici",
};

export default async function AccountPage() {
  let profile: UserProfileDto | null = null;
  let error: string | null = null;
  try {
    profile = await getMyProfile();
  } catch (e) {
    error = e instanceof Error ? e.message : "Profil yüklenemedi.";
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader title="Hesabım" subtitle="Profil bilgilerini görüntüle ve güncelle." />

      {error || !profile ? (
        <p className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-body-md text-danger">
          {error ?? "Profil bulunamadı."}
        </p>
      ) : (
        <>
          <div className="mb-8 flex items-center gap-4">
            <Avatar name={profile.fullName} src={profile.avatarUrl} size={64} />
            <div>
              <p className="text-heading-md">{profile.fullName ?? "enndip kullanıcısı"}</p>
              <p className="text-body-sm">
                {ROLE_LABEL[profile.role] ?? "Bireysel üye"}
              </p>
            </div>
          </div>
          <AccountForm profile={profile} />
        </>
      )}
    </div>
  );
}
