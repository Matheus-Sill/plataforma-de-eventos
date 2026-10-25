"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSessionUser } from "@/lib/api-client";

// Redireciona para o login se não houver um ADMIN na sessão.
// Retorna true quando a sessão foi validada.
export function useRequireAdmin() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const user = getSessionUser();
    if (!user || user.role !== "ADMIN") {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [router]);

  return ready;
}