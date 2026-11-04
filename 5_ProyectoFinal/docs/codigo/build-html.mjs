// Arma codigo.html: todos los documentos en una página, con índice, scroll suave y botón "volver arriba".
// Uso: node build-html.mjs <carpeta con los .html que generó marked>
import fs from 'node:fs';
import path from 'node:path';

const src = process.argv[2];
const files = fs.readdirSync('.').filter((f) => f.endsWith('.md')).sort((a, b) => (a === 'README.md' ? -1 : b === 'README.md' ? 1 : a.localeCompare(b)));
const slug = (f) => 'doc-' + f.replace(/\.md$/, '').toLowerCase();
const title = (f) => fs.readFileSync(f, 'utf8').match(/^# (.+)$/m)[1];

const sections = files.map((f) => {
  let html = fs.readFileSync(path.join(src, f.replace(/\.md$/, '.html')), 'utf8');
  // Los enlaces entre documentos pasan a ser anclas dentro de la misma página.
  html = html.replace(/href="([\w-]+)\.md"/g, (_, n) => `href="#${slug(n + '.md')}"`);
  return `<section id="${slug(f)}">${html}<a class="up" href="#top">↑ Volver arriba</a></section>`;
});
const nav = files.map((f) => `<a href="#${slug(f)}">${title(f).replace(/^\d+\.\s*/, '').replace(/`/g, '')}</a>`).join('');

fs.writeFileSync('codigo.html', `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Código explicado</title>
<style>
:root{--bg:#f6f7f9;--card:#fff;--text:#1d2330;--muted:#5d6675;--accent:#248a3d;--line:#e2e5ea}
@media (prefers-color-scheme:dark){:root{--bg:#0d0f12;--card:#16191e;--text:#e9ecf1;--muted:#9aa3b2;--accent:#30d158;--line:#272c34}}
html{scroll-behavior:smooth;scroll-padding-top:16px}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif}
.layout{display:grid;grid-template-columns:260px minmax(0,1fr);gap:32px;max-width:1200px;margin:0 auto;padding:24px 16px}
nav{position:sticky;top:16px;align-self:start;display:flex;flex-direction:column;gap:2px;max-height:calc(100vh - 32px);overflow:auto}
nav a{color:var(--muted);text-decoration:none;padding:6px 10px;border-radius:8px;font-size:14px}
nav a:hover,nav a.on{background:var(--card);color:var(--accent)}
section{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:8px 28px 20px;margin-bottom:24px}
h1{font-size:26px}h2{border-top:1px solid var(--line);padding-top:18px}
a{color:var(--accent)}code{background:var(--bg);padding:1px 5px;border-radius:5px;font-size:.9em}
table{border-collapse:collapse;width:100%;display:block;overflow-x:auto}td,th{border:1px solid var(--line);padding:6px 10px;text-align:left;vertical-align:top}
.up{display:inline-block;margin-top:12px;font-size:14px;text-decoration:none}
#top-btn{position:fixed;right:20px;bottom:20px;width:48px;height:48px;border-radius:50%;border:0;background:var(--accent);color:#fff;font-size:22px;cursor:pointer;
 box-shadow:0 4px 14px rgba(0,0,0,.25);opacity:0;transform:translateY(16px);pointer-events:none;transition:opacity .25s ease,transform .25s ease}
#top-btn.show{opacity:1;transform:none;pointer-events:auto}
#top-btn:hover{transform:translateY(-2px)}
@media (max-width:800px){.layout{grid-template-columns:1fr}nav{position:static;max-height:none}section{padding:4px 16px 16px}}
</style></head>
<body id="top"><div class="layout"><nav>${nav}</nav><main>${sections.join('\n')}</main></div>
<button id="top-btn" aria-label="Volver arriba" title="Volver arriba">↑</button>
<script>
const btn=document.getElementById('top-btn');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
addEventListener('scroll',()=>btn.classList.toggle('show',scrollY>400),{passive:true});
btn.onclick=()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'});
// Marca en el índice el documento que se está leyendo.
const links=[...document.querySelectorAll('nav a')];
const io=new IntersectionObserver((es)=>es.forEach((e)=>{if(e.isIntersecting)links.forEach((a)=>a.classList.toggle('on',a.hash==='#'+e.target.id))}),{rootMargin:'-40% 0px -55% 0px'});
document.querySelectorAll('section').forEach((s)=>io.observe(s));
</script></body></html>`);
console.log('codigo.html listo');
