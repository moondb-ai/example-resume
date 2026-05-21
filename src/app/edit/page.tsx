"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { moondb, MoonDBError } from "@/lib/moondb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TEMPLATES, type TemplateId, renderResumeHtml } from "@/lib/templates";
import { toast } from "sonner";

type Resume = {
  id: string;
  title: string;
  raw_input: string;
  structured_md: string;
  template: TemplateId;
  status: string;
  slug: string | null;
};

const MAX_PUBLISHED = 3;

export default function EditResumePage() {
  const pathname = usePathname();
  const id = pathname.split("/edit/")[1];
  const { user, token, loading: authLoading } = useAuth();
  const [resume, setResume] = useState<Resume | null>(null);
  const [structuredMd, setStructuredMd] = useState("");
  const [template, setTemplate] = useState<TemplateId>("minimal");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [publishedCount, setPublishedCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (!id) return;

    Promise.all([
      moondb(`/api/resumes/${id}`, { token }),
      moondb("/api/resumes?status=eq.published", { token }),
    ])
      .then(([resumeRes, publishedRes]) => {
        const r = resumeRes.data;
        setResume(r);
        setStructuredMd(r.structured_md || "");
        setTemplate(r.template);
        setSlug(r.slug || "");
        setPublishedCount(publishedRes.data.length);
      })
      .catch(() => {
        toast.error("Failed to load resume");
        router.push("/dashboard");
      });
  }, [id, user, token, authLoading, router]);

  useEffect(() => {
    if (structuredMd && template) {
      setPreviewHtml(renderResumeHtml(structuredMd, template, resume?.title || "Resume"));
    }
  }, [structuredMd, template, resume?.title]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await moondb(`/api/resumes/${id}`, {
        method: "PATCH",
        token,
        body: { structured_md: structuredMd, template },
      });
      toast.success("Saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!resume) return;
    setRegenerating(true);
    try {
      const aiRes = await moondb("/ai/structure_resume", {
        method: "POST",
        token,
        body: { text: resume.raw_input },
      });
      setStructuredMd(aiRes.data.result);
      toast.success("Regenerated");
    } catch {
      toast.error("Failed to regenerate");
    } finally {
      setRegenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!slug.trim()) {
      toast.error("Enter a slug for your public URL");
      return;
    }
    if (resume?.status !== "published" && publishedCount >= MAX_PUBLISHED) {
      toast.error("Maximum 3 published resumes");
      return;
    }
    setPublishing(true);
    try {
      await moondb(`/api/resumes/${id}`, {
        method: "PATCH",
        token,
        body: {
          structured_md: structuredMd,
          template,
          status: "published",
          slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        },
      });
      toast.success("Published!");
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof MoonDBError && err.code === "VALIDATION_DUPLICATE") {
        toast.error("This slug is already taken. Choose a different one.");
      } else {
        toast.error(err instanceof Error ? err.message : "Failed to publish");
      }
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    setSaving(true);
    try {
      await moondb(`/api/resumes/${id}`, {
        method: "PATCH",
        token,
        body: { status: "draft" },
      });
      toast.success("Unpublished");
      setResume((prev) => (prev ? { ...prev, status: "draft" } : null));
      setPublishedCount((c) => c - 1);
    } catch {
      toast.error("Failed to unpublish");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !resume) {
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
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold font-mono">{resume.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={resume.status === "published" ? "default" : "secondary"}
                className="font-mono text-[10px]"
              >
                {resume.status}
              </Badge>
              {resume.status === "published" && resume.slug && (
                <span className="text-[10px] text-muted-foreground font-mono">
                  /r/{resume.slug}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="font-mono text-xs"
              onClick={() => router.push("/dashboard")}
            >
              &larr; back
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="font-mono text-sm">markdown editor</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={structuredMd}
                  onChange={(e) => setStructuredMd(e.target.value)}
                  className="font-mono text-xs min-h-[400px] leading-relaxed"
                />
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    size="sm"
                    className="font-mono text-xs"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "saving..." : "save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="font-mono text-xs"
                    onClick={handleRegenerate}
                    disabled={regenerating}
                  >
                    {regenerating ? "regenerating..." : "regenerate with AI"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="font-mono text-sm">template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={`p-3 rounded-md border text-left transition-colors ${
                        template === t.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <p className="text-xs font-mono font-medium">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {t.description}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="font-mono text-sm">publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="font-mono text-xs">
                    public url slug
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">/r/</span>
                    <Input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="font-mono text-xs"
                      placeholder="john-smith-2025"
                    />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="font-mono text-xs"
                    onClick={handlePublish}
                    disabled={publishing}
                  >
                    {publishing
                      ? "publishing..."
                      : resume.status === "published"
                        ? "update & publish"
                        : "publish"}
                  </Button>
                  {resume.status === "published" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="font-mono text-xs text-destructive"
                      onClick={handleUnpublish}
                    >
                      unpublish
                    </Button>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">
                  {publishedCount}/{MAX_PUBLISHED} published resumes used
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="sticky top-4">
              <CardHeader className="pb-3">
                <CardTitle className="font-mono text-sm">preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-border overflow-hidden bg-white">
                  <iframe
                    srcDoc={previewHtml}
                    className="w-full min-h-[600px] border-0"
                    title="Resume preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
