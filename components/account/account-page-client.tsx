"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/ui/avatar";
import { AccountForm } from "@/components/account/account-form";
import { AccountPageSkeleton } from "@/components/skeletons/pages";
import { useProfile } from "@/lib/query/hooks";
import { BffError } from "@/lib/bff/client-fetch";

const ROLE_LABEL: Record<string, string> = {
  user: "Bireysel üye",
  dealer: "Bayi",
  admin: "Yönetici",
};

export function AccountPageClient() {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading && !profile) {
    return <AccountPageSkeleton />;
  }

  const authError = error instanceof BffError && error.status === 401;

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader title="Hesabım" subtitle="Profil bilgilerini görüntüle ve güncelle." />

      {authError || (error && !profile) ? (
        <p className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-body-md text-danger">
          {authError
            ? "Hesabını görmek için giriş yapmalısın."
            : error instanceof Error
              ? error.message
              : "Profil yüklenemedi."}
        </p>
      ) : profile ? (
        <>
          <div className="mb-8 flex items-center gap-4">
            <Avatar name={profile.fullName} src={profile.avatarUrl} size={64} />
            <div>
              <p className="text-heading-md">{profile.fullName ?? "enndip kullanıcısı"}</p>
              <p className="text-body-sm">{ROLE_LABEL[profile.role] ?? "Bireysel üye"}</p>
            </div>
          </div>
          <AccountForm profile={profile} />
        </>
      ) : (
        <p className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-body-md text-danger">
          Profil bulunamadı.
        </p>
      )}
    </div>
  );
}
