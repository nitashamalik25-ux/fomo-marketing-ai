const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const proj = __dirname;
  const src = fs.readFileSync(path.join(proj, 'Designed Ads Sample.dc.html'), 'utf8');
  const outDir = process.argv[2] || path.join(proj, 'png-out');
  fs.mkdirSync(outDir, { recursive: true });

  // --- Build a standalone page that skips the React runtime (support.js) ---
  const links = (src.match(/<link[^>]*>/g) || []).filter(l => /fonts\.g/.test(l)).join('\n');
  const styleM = src.match(/<style>([\s\S]*?)<\/style>/);
  const style = styleM ? styleM[1] : '';
  let inner = src.slice(src.indexOf('<x-dc>') + 6, src.lastIndexOf('</x-dc>'));
  inner = inner.replace(/<helmet>[\s\S]*?<\/helmet>/, ''); // drop the helmet block

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
${links}
<style>
${style}
html,body{margin:0;background:#ffffff;}
</style>
<script src="image-slot.js"></script>
</head><body>${inner}</body></html>`;

  const tmp = path.join(proj, '_render.html');
  fs.writeFileSync(tmp, html);

  const browser = await chromium.launch({ args: ['--force-color-profile=srgb'] });
  const page = await browser.newPage({ deviceScaleFactor: 1, viewport: { width: 1300, height: 2200 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));

  await page.goto('file://' + tmp, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
  });
  await page.waitForTimeout(1500);

  // Full-bleed corners for export (the 14px radius is a canvas-presentation detail).
  await page.$$eval('.ad', els => els.forEach(el => { el.style.borderRadius = '0'; el.style.boxShadow = 'none'; }));

  const ads = await page.$$eval('.ad', els => els.map((el, i) => {
    const lbl = el.parentElement.querySelector('.lbl');
    const name = lbl ? lbl.textContent.trim() : ('ad' + i);
    const r = el.getBoundingClientRect();
    return { i, name, w: Math.round(r.width), h: Math.round(r.height) };
  }));

  const handles = await page.$$('.ad');
  const manifest = [];
  for (let i = 0; i < handles.length; i++) {
    const raw = ads[i].name;
    const name = raw.replace(/[·•]/g, '_').replace(/[^A-Za-z0-9_-]+/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
    const fname = `${String(i + 1).padStart(2, '0')}_${name}.png`;
    await handles[i].screenshot({ path: path.join(outDir, fname) });
    manifest.push({ file: fname, label: raw, w: ads[i].w, h: ads[i].h });
    console.log(`wrote ${fname}  (${ads[i].w}x${ads[i].h})`);
  }

  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('PAGE ERRORS:', errors.length ? errors : 'none');
  await browser.close();
})();
