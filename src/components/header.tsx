"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="border-b border-border">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 h-14">
        <Link href="/" className="font-mono text-sm font-bold tracking-tight hover:opacity-80 transition-opacity">
          ai-resume<span className="text-muted-foreground">_</span>
        </Link>
        {!loading && (
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="font-mono text-xs">
                    dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="font-mono text-xs text-muted-foreground"
                >
                  logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-mono text-xs">
                  login
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
