import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { marked } from "marked";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "src");
const ROOT_NM = path.resolve(__dirname, "..", "..", "node_modules");

const app = express();
const PORT = 4000;

// Serve highlight.js from hoisted node_modules
app.use(
  "/hljs",
  express.static(path.join(ROOT_NM, "highlight.js")),
);

// ── Navigation ──────────────────────────────────────────
const NAV = [
  { title: "Home", href: "index" },
  {
    title: "Architecture",
    children: [
      { title: "Overview", href: "01-architecture/overview" },
      { title: "CQRS Pattern", href: "01-architecture/cqrs-pattern" },
      { title: "Module Communication", href: "01-architecture/module-communication" },
    ],
  },
  {
    title: "API Reference",
    children: [
      { title: "Auth API", href: "02-api/auth" },
      { title: "Users API", href: "02-api/users" },
      { title: "Categories API", href: "02-api/categories" },
    ],
  },
  {
    title: "Modules",
    children: [
      { title: "Auth Module", href: "03-modules/auth" },
      { title: "Users Module", href: "03-modules/users" },
      { title: "Categories Module", href: "03-modules/categories" },
    ],
  },
  {
    title: "Guides",
    children: [
      { title: "Adding a New CQRS Flow", href: "04-guides/adding-new-cqrs-flow" },
      { title: "Extending Auth", href: "04-guides/extending-auth" },
    ],
  },
  {
    title: "Reference",
    children: [
      { title: "Changed File Tree", href: "05-reference/file-tree" },
      { title: "Shared Types", href: "05-reference/types" },
    ],
  },
  {
    title: "How It Works",
    children: [
      { title: "Docs Server", href: "06-how-it-works/docs-server" },
    ],
  },
];

// ── Template ─────────────────────────────────────────────
function renderNav(activeHref) {
  let html = '<ul class="nav-list">';
  for (const item of NAV) {
    if (item.href) {
      const active = activeHref === item.href ? ' class="active"' : "";
      html += `<li><a${active} href="/docs/${item.href}">${item.title}</a></li>`;
    } else if (item.children) {
      html += `<li class="nav-section">${item.title}</li>`;
      for (const child of item.children) {
        const active = activeHref === child.href ? ' class="active"' : "";
        html += `<li class="nav-child"><a${active} href="/docs/${child.href}">${child.title}</a></li>`;
      }
    }
  }
  html += "</ul>";
  return html;
}

function renderPage(title, contentHtml, activeHref) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Budget Calc Docs</title>
<!-- highlight.js theme loaded dynamically via JS below -->
<style>
:root {
  --bg:#f9fafb; --text:#1f2937;
  --sidebar-bg:#111827; --sidebar-text:#e5e7eb; --sidebar-border:#1f2937; --sidebar-h1:#f9fafb;
  --section-text:#6b7280;
  --nav-link:#9ca3af; --nav-hover-bg:#1f2937; --nav-hover-text:#e5e7eb;
  --accent:#3b82f6; --accent-text:#fff;
  --h2-border:#e5e7eb;
  --code-bg:#f3f4f6;
  --pre-bg:#f8f9fa; --pre-border:#e5e7eb;
  --quote-text:#4b5563; --quote-bg:#f3f4f6;
  --table-border:#e5e7eb; --th-bg:#f9fafb;
  --link:#3b82f6;
  --hr:#e5e7eb;
}
@media(prefers-color-scheme:dark){:root:not([data-theme]){--bg:#0f172a;--text:#e2e8f0;--sidebar-bg:#020617;--sidebar-text:#94a3b8;--sidebar-border:#1e293b;--sidebar-h1:#f1f5f9;--section-text:#64748b;--nav-link:#64748b;--nav-hover-bg:#1e293b;--nav-hover-text:#e2e8f0;--h2-border:#334155;--code-bg:#1e293b;--pre-bg:#1e293b;--pre-border:#334155;--quote-text:#94a3b8;--quote-bg:#1e293b;--table-border:#334155;--th-bg:#1e293b;--link:#60a5fa;--hr:#334155}}
:root[data-theme="dark"]{--bg:#0f172a;--text:#e2e8f0;--sidebar-bg:#020617;--sidebar-text:#94a3b8;--sidebar-border:#1e293b;--sidebar-h1:#f1f5f9;--section-text:#64748b;--nav-link:#64748b;--nav-hover-bg:#1e293b;--nav-hover-text:#e2e8f0;--h2-border:#334155;--code-bg:#1e293b;--pre-bg:#1e293b;--pre-border:#334155;--quote-text:#94a3b8;--quote-bg:#1e293b;--table-border:#334155;--th-bg:#1e293b;--link:#60a5fa;--hr:#334155}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:var(--text);background:var(--bg);display:flex;min-height:100vh}
.sidebar{width:280px;background:var(--sidebar-bg);color:var(--sidebar-text);padding:1.5rem;position:fixed;top:0;left:0;height:100vh;overflow-y:auto;display:flex;flex-direction:column}
.sidebar-header{display:flex;align-items:center;gap:.5rem;margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid var(--sidebar-border)}
.sidebar-header h1{font-size:1.15rem;font-weight:700;color:var(--sidebar-h1)}
.badge{font-size:.65rem;background:var(--accent);color:var(--accent-text);padding:.15rem .5rem;border-radius:999px;font-weight:600;text-transform:uppercase;letter-spacing:.03em}
.nav-list{list-style:none}.nav-list li{margin-bottom:.2rem}
.nav-section{font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--section-text);margin-top:1.25rem;margin-bottom:.35rem;font-weight:600}
.nav-list a{display:block;padding:.35rem .75rem;border-radius:6px;color:var(--nav-link);text-decoration:none;font-size:.875rem;transition:all .12s}
.nav-list a:hover{background:var(--nav-hover-bg);color:var(--nav-hover-text)}
.nav-list a.active{background:var(--accent);color:var(--accent-text);font-weight:500}
.nav-child{padding-left:.75rem}
.content{margin-left:280px;flex:1;padding:2.5rem 3rem;max-width:960px;min-height:100vh}
.content h1{font-size:2rem;font-weight:700;margin-bottom:1rem;margin-top:0}
.content h1:first-child{margin-top:0}
.content h2{font-size:1.4rem;font-weight:600;margin-top:2rem;margin-bottom:.75rem;padding-bottom:.3rem;border-bottom:1px solid var(--h2-border)}
.content h3{font-size:1.15rem;font-weight:600;margin-top:1.5rem;margin-bottom:.5rem}
.content p{margin-bottom:1rem;line-height:1.7}
.content ul,.content ol{margin-bottom:1rem;padding-left:1.5rem}
.content li{margin-bottom:.3rem;line-height:1.6}
.content code{background:var(--code-bg);padding:.15rem .35rem;border-radius:4px;font-size:.85em;font-family:'JetBrains Mono','Fira Code',monospace}
.content pre{background:var(--pre-bg);border:1px solid var(--pre-border);border-radius:8px;padding:1rem;overflow-x:auto;margin-bottom:1rem}
.content pre code{background:none;padding:0;font-size:.85rem}
.content blockquote{border-left:4px solid var(--accent);padding-left:1rem;color:var(--quote-text);margin-bottom:1rem;background:var(--quote-bg);padding:.75rem 1rem;border-radius:0 6px 6px 0}
.content table{width:100%;border-collapse:collapse;margin-bottom:1rem;font-size:.9rem}
.content th,.content td{border:1px solid var(--table-border);padding:.5rem .75rem;text-align:left}
.content th{background:var(--th-bg);font-weight:600}
.content hr{margin:1.5rem 0;border:none;border-top:1px solid var(--hr)}
.content img{max-width:100%;border-radius:6px;margin:1rem 0}
.content a{color:var(--link);text-decoration:none}.content a:hover{text-decoration:underline}
.sidebar-footer{margin-top:auto;padding-top:1rem;border-top:1px solid var(--sidebar-border);display:flex;justify-content:center}
.theme-btn{background:none;border:1px solid var(--nav-link);color:var(--nav-link);padding:.35rem .75rem;border-radius:6px;cursor:pointer;font-size:.8rem;transition:all .12s;width:100%}
.theme-btn:hover{background:var(--nav-hover-bg);color:var(--nav-hover-text)}
@media(max-width:768px){
.sidebar{width:100%;height:auto;position:relative}.content{margin-left:0;padding:1.5rem}body{flex-direction:column}
}
</style>
</head>
<body>
<aside class="sidebar"><div class="sidebar-header"><h1>Budget Calc</h1><span class="badge">Docs</span></div>
<nav>${renderNav(activeHref)}</nav>
<div class="sidebar-footer"><button class="theme-btn" id="themeToggle" title="Toggle theme">🌓 Theme</button></div></aside>
<main class="content"><article>${contentHtml}</article>
</main>
<script src="/hljs/highlight.min.js" defer></script>
<script>
(function() {
  // Determine initial theme
  var saved = localStorage.getItem('docs-theme') || '';
  var prefers = window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  var theme = saved || prefers;
  var doc = document.documentElement;
  doc.setAttribute('data-theme', theme);

  // Load the matching highlight.js stylesheet
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/hljs/styles/' + (theme === 'dark' ? 'github-dark' : 'github') + '.min.css';
  document.head.appendChild(link);

  // Theme toggle
  document.getElementById('themeToggle').onclick = function() {
    var next = doc.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    doc.setAttribute('data-theme', next);
    localStorage.setItem('docs-theme', next);
    // Swap highlight.js stylesheet
    var hlLink = document.querySelector('link[href*="highlight"]');
    if (hlLink) hlLink.href = '/hljs/styles/' + (next === 'dark' ? 'github-dark' : 'github') + '.min.css';
  };
})();
</script>
</body>
</html>`;
}

// ── Routes ───────────────────────────────────────────────
app.get("/", (_req, res) => res.redirect("/docs/index"));

// Use wildcard middleware — Express 5 / path-to-regexp v8
app.use("/docs", (req, res) => {
  const filePath = req.path.replace(/^\//, "").replace(/\.md$/i, "");
  const mdFile = path.join(SRC, filePath + ".md");

  // Security: prevent path traversal
  if (!mdFile.startsWith(SRC)) {
    res.status(403).send(renderPage("Forbidden", "<h1>403 — Forbidden</h1>", ""));
    return;
  }

  if (!fs.existsSync(mdFile)) {
    res.status(404).send(renderPage("Not Found", '<h1>404 — Page Not Found</h1><p><a href="/docs/index">Go home</a></p>', ""));
    return;
  }

  const md = fs.readFileSync(mdFile, "utf-8");
  const contentHtml = marked.parse(md, { async: false });

  const titleMatch = contentHtml.match(/<h1>(.*?)<\/h1>/);
  const title = titleMatch ? titleMatch[1] : filePath;

  res.send(renderPage(title, contentHtml, filePath));
});

// (root redirect handles both / and /docs)

// ── Start ────────────────────────────────────────────────
app.listen(PORT, () => {
  const border = "─".repeat(38);
  console.log(`\n  📖  Budget Calc Docs`);
  console.log(`  ${border}`);
  console.log(`  ➜  http://localhost:${PORT}`);
  console.log(`  ➜  http://localhost:${PORT}/docs/index\n`);
});
