import type { Metadata } from "next";
import { AccountPageClient } from "@/components/account/account-page-client";

export const metadata: Metadata = { title: "Hesabım" };

export default function AccountPage() {
  return <AccountPageClient />;
}
