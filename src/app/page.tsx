"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center space-y-8">
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground font-mono tracking-widest uppercase">
              AI-powered resume builder
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Paste your career story.<br />
              <span className="text-muted-foreground">Get a polished resume.</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
              Dump your unstructured career notes, achievements, and experience.
              Our AI structures it into a professional resume you can share with a link.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link href={user ? "/dashboard" : "/login"}>
              <Button size="lg" className="font-mono">
                {user ? "Go to Dashboard" : "Get Started"} &rarr;
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border text-left">
            <div className="space-y-1.5">
              <p className="text-xs font-mono text-muted-foreground">01</p>
              <p className="text-sm font-medium">Paste anything</p>
              <p className="text-xs text-muted-foreground">Unformatted notes, LinkedIn dumps, bullet points</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-mono text-muted-foreground">02</p>
              <p className="text-sm font-medium">AI structures it</p>
              <p className="text-xs text-muted-foreground">Gemma 4 formats into clean markdown sections</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-mono text-muted-foreground">03</p>
              <p className="text-sm font-medium">Share a link</p>
              <p className="text-xs text-muted-foreground">Pick a template, publish, share the URL</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
