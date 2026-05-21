"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { moondb } from "@/lib/moondb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { toast } from "sonner";

const MAX_RESUMES = 3;

export default function NewResumePage() {
  const { user, token, loading: authLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [rawInput, setRawInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [canCreate, setCanCreate] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    moondb("/api/resumes?sort=created_at.desc", { token })
      .then((res) => {
        if (res.data.length >= MAX_RESUMES) {
          setCanCreate(false);
          toast.error("Maximum 3 resumes reached");
        }
      })
      .catch(() => {});
  }, [user, token, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) return;
    setLoading(true);
    try {
      const aiRes = await moondb("/ai/structure_resume", {
        method: "POST",
        token,
        body: { text: rawInput },
      });

      const structured_md = aiRes.data.result;

      await moondb("/api/resumes", {
        method: "POST",
        token,
        body: {
          title,
          raw_input: rawInput,
          structured_md,
          template: "minimal",
          status: "draft",
        },
      });

      toast.success("Resume created!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create resume");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground font-mono animate-pulse">loading...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-mono text-lg">new resume</CardTitle>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              Paste your unstructured career text below. AI will format it.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-mono text-xs">
                  resume title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="font-mono"
                  placeholder="e.g. Software Engineer 2025"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="raw" className="font-mono text-xs">
                  your career text (paste anything)
                </Label>
                <Textarea
                  id="raw"
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  required
                  className="font-mono min-h-[300px] text-sm"
                  placeholder={`Paste your unformatted career info here...

Example:
John Smith, john@email.com, San Francisco
Worked at Google as Senior SWE from 2019-2023
Led a team of 5 building search infrastructure
Before that was at a startup called Acme doing fullstack
MIT CS degree 2015
Skills: Python, Go, React, Kubernetes, SQL
Speak English and Spanish fluently`}
                />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  className="font-mono"
                  disabled={loading || !canCreate}
                >
                  {loading ? "structuring with AI..." : "create resume"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="font-mono text-xs"
                  onClick={() => router.back()}
                >
                  cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
