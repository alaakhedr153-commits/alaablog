// يبني content/index.json من ملفات المقالات (يشتغل تلقائيًا على Netlify)
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'content', 'articles');
const out = [];
if (fs.existsSync(dir)) {
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md')) continue;
    const txt = fs.readFileSync(path.join(dir, f), 'utf8');
    const m = txt.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!m) continue;
    const d = {};
    for (const line of m[1].split('\n')) {
      const k = line.match(/^(title|title_en|author|date|draft):\s*(.*)$/);
      if (k) d[k[1]] = k[2].trim().replace(/^(['"])(.*)\1$/, '$2');
    }
    if (d.draft === 'true') continue;
    out.push({ slug: f.slice(0, -3), title: d.title || '', title_en: d.title_en || '', author: d.author || '', date: d.date || '' });
  }
}
out.sort((a, b) => String(b.date).localeCompare(String(a.date)));
fs.writeFileSync(path.join(__dirname, 'content', 'index.json'), JSON.stringify(out, null, 1));
console.log('articles:', out.length);
