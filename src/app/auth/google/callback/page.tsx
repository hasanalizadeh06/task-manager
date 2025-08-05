"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { clxRequest } from "@/shared/lib/api/clxRequest";

export default function GoogleCallback() {
  const searchParams = useSearchParams();
  useEffect(() => {
    const code = searchParams.get("code");
    clxRequest.get("/auth/google/callback?code=" + code)
      .then((res) => {
        console.log("Google login successful:", res);
      });
  }, [searchParams]);

  return (
    <div className="text-white flex justify-center items-center h-screen">
      Giriş yapılıyor...
    </div>
  );
}
