export type TemplateId = "minimal" | "classic" | "creative" | "terminal" | "executive" | "newspaper" | "blueprint" | "elegant" | "retro" | "nordic" | "academic" | "startup";

export const TEMPLATES: { id: TemplateId; name: string; description: string }[] = [
  { id: "minimal", name: "Minimal", description: "Clean whitespace, Swiss typography" },
  { id: "classic", name: "Classic", description: "Traditional resume, serif fonts" },
  { id: "creative", name: "Creative", description: "Bold colors, modern layout" },
  { id: "terminal", name: "Terminal", description: "Hacker aesthetic, monospace" },
  { id: "executive", name: "Executive", description: "Dark navy, gold accents" },
  { id: "newspaper", name: "Newspaper", description: "Column layout, editorial feel" },
  { id: "blueprint", name: "Blueprint", description: "Engineering grid, technical" },
  { id: "elegant", name: "Elegant", description: "Thin serif, luxury spacing" },
  { id: "retro", name: "Retro", description: "Warm tones, typewriter vibe" },
  { id: "nordic", name: "Nordic", description: "Cool grays, Scandinavian calm" },
  { id: "academic", name: "Academic", description: "LaTeX-inspired, scholarly" },
  { id: "startup", name: "Startup", description: "Bright gradients, punchy sans" },
];

function escapeMd(md: string): string {
  return md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function mdToHtml(md: string): string {
  let html = escapeMd(md);

  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/^---$/gm, '<hr/>');
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');
  html = html.replace(/\n{2,}/g, '\n<br/>\n');

  return html;
}

export function renderResumeHtml(
  md: string,
  template: TemplateId,
  title: string
): string {
  const body = mdToHtml(md);

  const styles: Record<TemplateId, string> = {
    minimal: `
      body { font-family: 'Inter', 'Helvetica Neue', sans-serif; max-width: 800px; margin: 0 auto; padding: 60px 40px; color: #1a1a1a; background: #fff; line-height: 1.7; }
      h1 { font-size: 2.5rem; font-weight: 300; letter-spacing: -0.02em; margin-bottom: 0.25em; border-bottom: 1px solid #e5e5e5; padding-bottom: 0.5em; }
      h2 { font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #666; margin-top: 2.5em; margin-bottom: 0.75em; }
      h3 { font-size: 1.1rem; font-weight: 500; margin-bottom: 0.15em; }
      em { color: #888; font-style: normal; font-size: 0.9rem; }
      ul { padding-left: 1.2em; margin: 0.5em 0; }
      li { margin-bottom: 0.3em; font-size: 0.95rem; }
      hr { border: none; border-top: 1px solid #eee; margin: 2em 0; }
      strong { font-weight: 600; }
    `,
    classic: `
      body { font-family: 'Georgia', 'Times New Roman', serif; max-width: 780px; margin: 0 auto; padding: 50px 40px; color: #2c2c2c; background: #fafaf8; line-height: 1.65; }
      h1 { font-size: 2.2rem; font-weight: 700; text-align: center; margin-bottom: 0.2em; color: #1a1a1a; }
      h2 { font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 2px solid #333; padding-bottom: 0.3em; margin-top: 2em; margin-bottom: 0.75em; color: #1a1a1a; }
      h3 { font-size: 1.05rem; font-weight: 700; margin-bottom: 0.1em; }
      em { font-style: italic; color: #555; font-size: 0.92rem; }
      ul { padding-left: 1.5em; margin: 0.4em 0; }
      li { margin-bottom: 0.25em; font-size: 0.95rem; }
      li::marker { color: #333; }
      hr { border: none; border-top: 1px solid #ccc; margin: 1.5em 0; }
      strong { font-weight: 700; }
    `,
    creative: `
      body { font-family: 'Inter', 'Segoe UI', sans-serif; max-width: 850px; margin: 0 auto; padding: 50px 40px; color: #1e1e2e; background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%); line-height: 1.7; }
      h1 { font-size: 3rem; font-weight: 800; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 0.2em; }
      h2 { font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: #667eea; margin-top: 2.5em; margin-bottom: 0.75em; padding: 0.4em 0.8em; background: rgba(102,126,234,0.08); border-radius: 6px; display: inline-block; }
      h3 { font-size: 1.15rem; font-weight: 600; color: #2d2d3f; margin-bottom: 0.1em; }
      em { color: #888; font-style: normal; font-size: 0.9rem; }
      ul { padding-left: 1.2em; margin: 0.5em 0; }
      li { margin-bottom: 0.35em; font-size: 0.95rem; }
      li::marker { color: #667eea; }
      hr { border: none; height: 2px; background: linear-gradient(90deg, #667eea, #764ba2); margin: 2em 0; border-radius: 1px; }
      strong { font-weight: 700; color: #2d2d3f; }
    `,
    terminal: `
      body { font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace; max-width: 820px; margin: 0 auto; padding: 40px 30px; color: #00ff41; background: #0a0a0a; line-height: 1.6; }
      h1 { font-size: 1.8rem; font-weight: 700; color: #00ff41; margin-bottom: 0.3em; }
      h1::before { content: '$ cat '; color: #666; font-weight: 400; }
      h2 { font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #ffb800; margin-top: 2em; margin-bottom: 0.75em; }
      h2::before { content: '## '; color: #555; }
      h3 { font-size: 1rem; font-weight: 600; color: #41ffca; margin-bottom: 0.1em; }
      em { color: #888; font-style: normal; font-size: 0.85rem; }
      ul { padding-left: 1.2em; margin: 0.5em 0; list-style: none; }
      li { margin-bottom: 0.25em; font-size: 0.9rem; }
      li::before { content: '> '; color: #555; }
      hr { border: none; border-top: 1px dashed #333; margin: 1.5em 0; }
      strong { font-weight: 700; color: #ff5555; }
      ::selection { background: #00ff41; color: #0a0a0a; }
    `,
    executive: `
      body { font-family: 'Georgia', 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 60px 50px; color: #e8e0d0; background: #1a1f3a; line-height: 1.7; }
      h1 { font-size: 2.4rem; font-weight: 700; color: #d4a843; margin-bottom: 0.3em; letter-spacing: 0.02em; border-bottom: 2px solid #d4a843; padding-bottom: 0.4em; }
      h2 { font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em; color: #d4a843; margin-top: 2.5em; margin-bottom: 0.75em; }
      h3 { font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 0.15em; }
      em { color: #9a9480; font-style: italic; font-size: 0.9rem; }
      ul { padding-left: 1.3em; margin: 0.5em 0; }
      li { margin-bottom: 0.3em; font-size: 0.95rem; }
      li::marker { color: #d4a843; }
      hr { border: none; border-top: 1px solid #2a3060; margin: 2em 0; }
      strong { font-weight: 700; color: #fff; }
    `,
    newspaper: `
      body { font-family: 'Georgia', serif; max-width: 860px; margin: 0 auto; padding: 50px 40px; color: #222; background: #f5f0e8; line-height: 1.6; column-count: 2; column-gap: 40px; column-rule: 1px solid #ccc; }
      h1 { font-size: 2.8rem; font-weight: 900; text-align: center; column-span: all; margin-bottom: 0.1em; letter-spacing: -0.02em; border-bottom: 3px double #222; padding-bottom: 0.3em; text-transform: uppercase; }
      h2 { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 1.5em; margin-bottom: 0.5em; border-bottom: 1px solid #999; padding-bottom: 0.2em; column-span: all; }
      h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.1em; }
      em { font-style: italic; color: #555; font-size: 0.88rem; }
      ul { padding-left: 1.2em; margin: 0.4em 0; }
      li { margin-bottom: 0.2em; font-size: 0.9rem; text-align: justify; }
      hr { border: none; border-top: 1px solid #bbb; margin: 1.2em 0; column-span: all; }
      strong { font-weight: 700; }
    `,
    blueprint: `
      body { font-family: 'JetBrains Mono', 'Courier New', monospace; max-width: 840px; margin: 0 auto; padding: 50px 40px; color: #c8daf0; background: #0d1b2a; line-height: 1.65; background-image: linear-gradient(rgba(40,80,140,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(40,80,140,0.12) 1px, transparent 1px); background-size: 20px 20px; }
      h1 { font-size: 2rem; font-weight: 700; color: #fff; margin-bottom: 0.3em; border-bottom: 2px solid #3a7bd5; padding-bottom: 0.4em; }
      h2 { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; color: #3a7bd5; margin-top: 2.5em; margin-bottom: 0.75em; }
      h2::before { content: '// '; color: #2a5a9a; }
      h3 { font-size: 1rem; font-weight: 600; color: #7fb3f0; margin-bottom: 0.1em; }
      em { color: #6a8aaa; font-style: normal; font-size: 0.85rem; }
      ul { padding-left: 1.2em; margin: 0.5em 0; list-style: none; }
      li { margin-bottom: 0.25em; font-size: 0.88rem; }
      li::before { content: '├─ '; color: #3a7bd5; }
      hr { border: none; border-top: 1px dashed #2a4a7a; margin: 1.8em 0; }
      strong { font-weight: 700; color: #fff; }
    `,
    elegant: `
      body { font-family: 'Playfair Display', 'Georgia', serif; max-width: 760px; margin: 0 auto; padding: 80px 50px; color: #333; background: #fefefe; line-height: 1.85; }
      h1 { font-size: 2.8rem; font-weight: 400; letter-spacing: 0.08em; text-align: center; margin-bottom: 0.2em; color: #1a1a1a; }
      h2 { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3em; text-align: center; color: #999; margin-top: 3em; margin-bottom: 1em; }
      h2::before, h2::after { content: '\\2014\\2014  '; color: #ddd; }
      h3 { font-size: 1.1rem; font-weight: 600; font-style: italic; margin-bottom: 0.1em; color: #222; }
      em { color: #888; font-style: normal; font-size: 0.88rem; letter-spacing: 0.02em; }
      ul { padding-left: 1em; margin: 0.5em 0; list-style: none; }
      li { margin-bottom: 0.35em; font-size: 0.92rem; padding-left: 0.8em; border-left: 2px solid #e0d5c5; }
      hr { border: none; text-align: center; margin: 2.5em 0; }
      hr::after { content: '\\2726'; color: #ccc; font-size: 1.2rem; }
      strong { font-weight: 700; }
    `,
    retro: `
      body { font-family: 'Courier New', 'Courier', monospace; max-width: 800px; margin: 0 auto; padding: 50px 40px; color: #3b2e1a; background: #f4e8c1; line-height: 1.65; }
      h1 { font-size: 2.2rem; font-weight: 700; margin-bottom: 0.3em; color: #8b2500; border-bottom: 3px solid #8b2500; padding-bottom: 0.3em; }
      h2 { font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #8b2500; margin-top: 2em; margin-bottom: 0.75em; background: #e8d8a0; padding: 0.3em 0.6em; display: inline-block; }
      h3 { font-size: 1.05rem; font-weight: 700; color: #4a3520; margin-bottom: 0.1em; }
      em { color: #7a6840; font-style: italic; font-size: 0.9rem; }
      ul { padding-left: 1.5em; margin: 0.5em 0; }
      li { margin-bottom: 0.25em; font-size: 0.92rem; }
      li::marker { color: #8b2500; }
      hr { border: none; border-top: 2px dotted #c4a460; margin: 1.8em 0; }
      strong { font-weight: 700; color: #8b2500; }
    `,
    nordic: `
      body { font-family: 'Inter', 'Helvetica Neue', sans-serif; max-width: 780px; margin: 0 auto; padding: 60px 45px; color: #4a4a4a; background: #f7f7f5; line-height: 1.8; }
      h1 { font-size: 2rem; font-weight: 300; color: #2c2c2c; margin-bottom: 0.4em; letter-spacing: 0.04em; }
      h2 { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.25em; color: #8a8a8a; margin-top: 2.8em; margin-bottom: 0.8em; padding-bottom: 0.5em; border-bottom: 1px solid #e2e2de; }
      h3 { font-size: 1rem; font-weight: 500; color: #2c2c2c; margin-bottom: 0.1em; }
      em { color: #999; font-style: normal; font-size: 0.85rem; }
      ul { padding-left: 0; margin: 0.5em 0; list-style: none; }
      li { margin-bottom: 0.35em; font-size: 0.9rem; padding-left: 1em; position: relative; }
      li::before { content: '\\2013'; position: absolute; left: 0; color: #bbb; }
      hr { border: none; margin: 2.5em 0; }
      strong { font-weight: 600; color: #2c2c2c; }
    `,
    academic: `
      body { font-family: 'Computer Modern', 'Latin Modern', 'Georgia', serif; max-width: 750px; margin: 0 auto; padding: 55px 45px; color: #111; background: #fff; line-height: 1.5; font-size: 11pt; }
      h1 { font-size: 1.8rem; font-weight: 700; text-align: center; margin-bottom: 0.1em; }
      h2 { font-size: 1rem; font-weight: 700; margin-top: 1.8em; margin-bottom: 0.5em; border-bottom: 0.5px solid #111; padding-bottom: 0.15em; font-variant: small-caps; }
      h3 { font-size: 0.95rem; font-weight: 700; margin-bottom: 0.05em; }
      em { font-style: italic; color: #333; font-size: 0.9rem; }
      ul { padding-left: 1.5em; margin: 0.3em 0; }
      li { margin-bottom: 0.15em; font-size: 0.92rem; text-align: justify; }
      hr { border: none; border-top: 0.5px solid #111; margin: 1.5em 0; }
      strong { font-weight: 700; }
    `,
    startup: `
      body { font-family: 'Inter', 'SF Pro', sans-serif; max-width: 820px; margin: 0 auto; padding: 50px 40px; color: #1e1e1e; background: #fff; line-height: 1.7; }
      h1 { font-size: 2.8rem; font-weight: 800; margin-bottom: 0.2em; background: linear-gradient(135deg, #f857a6, #ff5858, #ffb347); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      h2 { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em; color: #fff; margin-top: 2.5em; margin-bottom: 0.75em; padding: 0.45em 1em; background: linear-gradient(135deg, #f857a6, #ff5858); border-radius: 50px; display: inline-block; }
      h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.1em; }
      em { color: #888; font-style: normal; font-size: 0.9rem; }
      ul { padding-left: 1.2em; margin: 0.5em 0; }
      li { margin-bottom: 0.3em; font-size: 0.95rem; }
      li::marker { color: #f857a6; }
      hr { border: none; height: 3px; background: linear-gradient(90deg, #f857a6, #ff5858, #ffb347); margin: 2em 0; border-radius: 2px; }
      strong { font-weight: 700; }
    `,
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title} | AI Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    ${styles[template]}
    @media print { body { padding: 20px; } }
    .footer { text-align: center; margin-top: 4em; padding-top: 1.5em; border-top: 1px solid ${["terminal", "executive", "blueprint"].includes(template) ? "#222" : "#e5e5e5"}; font-size: 0.75rem; color: ${["terminal", "executive", "blueprint"].includes(template) ? "#444" : "#999"}; ${template === "newspaper" ? "column-span: all;" : ""} }
    .footer a { color: ${template === "terminal" ? "#00ff41" : template === "executive" ? "#d4a843" : template === "blueprint" ? "#3a7bd5" : template === "startup" ? "#f857a6" : template === "retro" ? "#8b2500" : "#667eea"}; text-decoration: none; }
  </style>
</head>
<body>
  ${body}
  <div class="footer">
    Backend made with <a href="https://moondb.ai" target="_blank" rel="noopener">MoonDB.ai</a>
  </div>
</body>
</html>`;
}
