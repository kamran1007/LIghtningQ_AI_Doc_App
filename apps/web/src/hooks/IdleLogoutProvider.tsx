// hooks/IdleLogoutProvider.tsx
"use client";

import { useIdleLogout } from "@/hooks/useIdleLogout";

export default function IdleLogoutProvider() {
  useIdleLogout(10* 60 * 1000); // 30s
  return null; // it doesn’t render anything
}
