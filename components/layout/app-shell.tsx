import type { ReactNode } from "react";
import { ShellChrome } from "./shell-chrome";
import { getSessionIdentity } from "@/lib/auth/session";

/** (app) grubu için server kabuk — kimliği çözer, ShellChrome'a verir. */
export async function AppShell({ children }: { children: ReactNode }) {
  const identity = await getSessionIdentity();
  return <ShellChrome identity={identity}>{children}</ShellChrome>;
}
