import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";

/** İlan / profil mutasyonlarından sonra client cache'i tazele. */
export function invalidateUserData(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.home });
  void queryClient.invalidateQueries({ queryKey: queryKeys.listings });
  void queryClient.invalidateQueries({ queryKey: queryKeys.profile });
}
