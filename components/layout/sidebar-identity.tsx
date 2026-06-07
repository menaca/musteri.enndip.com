import { getSessionIdentity } from "@/lib/auth/session";
import { SidebarContent } from "./sidebar-content";

/** Async sidebar — kimlik çözülene kadar üst Suspense fallback gösterir. */
export async function SidebarIdentity({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const identity = await getSessionIdentity();
  return <SidebarContent identity={identity} onNavigate={onNavigate} />;
}
