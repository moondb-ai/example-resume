"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { moondb } from "@/lib/moondb";
import { renderResumeHtml } from "@/lib/templates";
import type { TemplateId } from "@/lib/templates";

export default function PublicResumePage() {
  const pathname = usePathname();
  const slug = pathname.split("/r/")[1];
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setError("Resume not found");
      setLoading(false);
      return;
    }
    moondb(`/api/resumes?slug=eq.${slug}&status=eq.published&limit=1`, {
      isPublic: true,
    })
      .then((res) => {
        if (!res.data || res.data.length === 0) {
          setError("Resume not found");
          return;
        }
        const resume = res.data[0];
        setHtml(
          renderResumeHtml(
            resume.structured_md,
            resume.template as TemplateId,
            resume.title
          )
        );
      })
      .catch(() => setError("Failed to load resume"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "monospace",
          color: "#888",
          background: "#0a0a0a",
        }}
      >
        loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "monospace",
          color: "#888",
          background: "#0a0a0a",
          gap: "1rem",
        }}
      >
        <p>{error}</p>
        <a
          href="/"
          style={{ color: "#fff", textDecoration: "underline" }}
        >
          go home
        </a>
      </div>
    );
  }

  return (
    <iframe
      srcDoc={html}
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
        background: "#fff",
      }}
      title="Resume"
      sandbox="allow-same-origin"
    />
  );
}
