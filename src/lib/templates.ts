export type TemplateId = "minimal" | "classic" | "creative" | "terminal";

export const TEMPLATES: { id: TemplateId; name: string; description: string }[] = [
  { id: "minimal", name: "Minimal", description: "Clean whitespace, Swiss typography" },
  { id: "classic", name: "Classic", description: "Traditional resume, serif fonts" },
  { id: "creative", name: "Creative", description: "Bold colors, modern layout" },
  { id: "terminal", name: "Terminal", description: "Hacker aesthetic, monospace" },
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
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title} | AI Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    ${styles[template]}
    @media print { body { padding: 20px; } }
    .footer { text-align: center; margin-top: 4em; padding-top: 1.5em; border-top: 1px solid ${template === "terminal" ? "#222" : "#e5e5e5"}; font-size: 0.75rem; color: ${template === "terminal" ? "#444" : "#999"}; }
    .footer a { color: ${template === "terminal" ? "#00ff41" : "#667eea"}; text-decoration: none; }
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
