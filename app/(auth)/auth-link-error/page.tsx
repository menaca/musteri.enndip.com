import type { Metadata } from "next";
import Link from "next/link";
import { AlertIcon } from "@/components/ui/icons";
import { Routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Bağlantı Hatası" };

export default async function AuthLinkErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-12 flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-danger">
          <AlertIcon size={30} />
        </div>
        <h1 className="mt-6 text-display-md">Bağlantı geçersiz</h1>
        <p className="mt-3 max-w-sm text-body-md text-muted">
          {message ||
            "Bağlantının süresi dolmuş veya daha önce kullanılmış olabilir. Lütfen giriş yaparak tekrar dene."}
        </p>
      </div>

      <div className="mt-10">
        <Link href={Routes.login} className="btn-primary w-full">
          Giriş Yap
        </Link>
      </div>
    </div>
  );
}
