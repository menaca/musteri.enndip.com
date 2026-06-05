/** Rota path sabitleri (Flutter AppRoutes karşılığı). */
export const Routes = {
  onboarding: "/onboarding",
  login: "/login",
  register: "/register",
  passwordReset: "/password-reset",
  signupVerify: "/signup-verify",
  authLinkError: "/auth-link-error",
  authCallback: "/auth/callback",

  home: "/",
  findCar: "/find-car",
  listingVehicleOptions: "/listing/vehicle-options",
  listingSummary: "/listing/summary",
  listingOffer: "/listing/offer",

  account: "/account",
  myListings: "/my-listings",
  preferences: "/preferences",
  notifications: "/notifications",
  buyFromEnndip: "/buy-from-enndip",
  contact: "/contact",
  howItWorks: "/how-it-works",
} as const;

/** Oturum gerektiren rotalar (guest/anon → /login). */
export const AUTH_REQUIRED_PATHS = [Routes.account, Routes.myListings];

/** Oturumluyken erişilince /home'a atılan public auth rotaları. */
export const AUTH_PUBLIC_PATHS = [
  Routes.login,
  Routes.register,
  Routes.passwordReset,
  Routes.onboarding,
];
