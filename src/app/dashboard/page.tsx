"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { moondb } from "@/lib/moondb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { toast } from "sonner";

type Resume = {
  id: string;
  title: string;
  template: string;
  status: string;
  slug: string | null;
  created_at: string;
};

const MAX_RESUMES = 3;

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    moondb("/api/resumes?sort=created_at.desc", { token })
      .then((res) => setResumes(res.data))
      .catch(() => toast.error("Failed to load resumes"))
      .finally(() => setLoading(false));
  }, [user, token, authLoading, router]);

  const handleDelete = async (id: string) => {
    try {
      await moondb(`/api/resumes/${id}`, { method: "DELETE", token });
      setResumes((prev) => prev.filter((r) => r.id !== id));
      toast.success("Resume deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (authLoading || loading) {
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

  const publishedCount = resumes.filter((r) => r.status === "published").length;

  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-mono">your resumes</h1>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              {resumes.length}/{MAX_RESUMES} created &middot; {publishedCount}/{MAX_RESUMES} published
            </p>
          </div>
          {resumes.length < MAX_RESUMES && (
            <Link href="/new">
              <Button className="font-mono text-xs">+ new resume</Button>
            </Link>
          )}
        </div>

        {resumes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-sm text-muted-foreground font-mono">
                No resumes yet. Create your first one.
              </p>
              <Link href="/new" className="mt-4 inline-block">
                <Button className="font-mono text-xs">+ new resume</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <Card key={resume.id} className="group">
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-sm font-mono">
                        {resume.title}
                      </CardTitle>
                      <Badge
                        variant={resume.status === "published" ? "default" : "secondary"}
                        className="font-mono text-[10px]"
                      >
                        {resume.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {resume.template}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/edit/${resume.id}`}>
                        <Button variant="ghost" size="sm" className="font-mono text-xs">
                          edit
                        </Button>
                      </Link>
                      {resume.status === "published" && resume.slug && (
                        <Link href={`/r/${resume.slug}`} target="_blank">
                          <Button variant="ghost" size="sm" className="font-mono text-xs">
                            view
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="font-mono text-xs text-destructive"
                        onClick={() => handleDelete(resume.id)}
                      >
                        delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
