"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AdminBackButton({ className = "" }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = useCallback(() => {
    try {
      // Prefer native history back when available
      if (typeof window !== "undefined" && window.history?.length > 1) {
        router.back();
        return;
      }

      // Fallback: always stay within admin area
      router.replace("/admin/dashboard");
    } catch (err) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  // Hide on the top-level admin landing and dashboard
  if (!pathname || pathname === "/admin" || pathname === "/admin/dashboard") {
    return null;
  }

  return (
    <div className={className}>
      <Button
        onClick={handleBack}
        variant="ghost"
        size="sm"
        className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted/50"
        aria-label="Go back"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Back</span>
      </Button>
    </div>
  );
}
