const fs = require('fs');
const path = require('path');

try {
  const cssPath = path.join(__dirname, 'src', 'App.css');
  let css = fs.readFileSync(cssPath, 'utf8');

  // 1. Replace CSS custom properties
  css = css.replace(/:root\s*{[\s\S]*?--content-width:[^;]+;/m, `:root {
    --accent: #22c55e;
    --accent-soft: #dcfce7;
    --accent-strong: #16a34a;
    --bg-app: #f3f4f6;
    --bg-panel: #ffffff;
    --bg-card: #ffffff;
    --bg-card-strong: #f9fafb;
    --bg-card-soft: #ffffff;
    --border: #e5e7eb;
    --border-strong: #d1d5db;
    --text: #1f2937;
    --text-muted: #6b7280;
    --text-soft: #4b5563;
    --surface-glow: none;
    --shadow-soft: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
    --success: #22c55e;
    --warning: #f59e0b;
    --danger: #ef4444;
    --info: #3b82f6;
    --radius-lg: 1rem;
    --radius-md: 1rem;
    --radius-sm: 0.5rem;
    --content-width: 1380px;`);

  // 2. Remove body gradient
  css = css.replace(/background:\s*radial-gradient\([\s\S]*?linear-gradient\([\s\S]*?100%\);/m, 'background: var(--bg-app);');

  // 3. Remove neon shadows on primary buttons
  css = css.replace(/box-shadow:.*?rgba\(57,\s*255,\s*20.*?;/g, '');

  // 4. Update the primary button gradient to a flat color
  css = css.replace(/background:\s*linear-gradient\(135deg,\s*var\(--accent\)\s*0%,\s*[^;]+;/g, 'background: var(--accent);');

  // 5. Hardcoded dark backgrounds mapping to --bg-card or --bg-app
  css = css.replace(/background:\s*rgba\(12,\s*23,\s*19,\s*0\.[\d]+\)/g, 'background: var(--bg-card)');
  css = css.replace(/background:\s*rgba\(4,\s*11,\s*9,\s*0\.[\d]+\)/g, 'background: var(--bg-card-strong)');
  css = css.replace(/background:\s*rgba\(12,\s*23,\s*19,\s*0\.96\)/g, 'background: var(--bg-card)');
  css = css.replace(/background:\s*rgba\(8,\s*17,\s*14,\s*0\.95\)/g, 'background: var(--bg-app)');

  // 6. Hardcoded dark borders mapping to --border
  css = css.replace(/border-color:\s*rgba\(57,\s*255,\s*20,\s*0\.[\d]+\)/g, 'border-color: var(--border-strong)');
  css = css.replace(/border:\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.0[4-6]\)/g, 'border: 1px solid var(--border)');
  css = css.replace(/border-(bottom|top|left|right):\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.0[4-6]\)/g, 'border-$1: 1px solid var(--border)');

  // 7. Hover effects
  css = css.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.0[2-5]\)/g, 'background: var(--bg-card-strong)');
  css = css.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.08\)/g, 'background: var(--bg-card-strong)');
  css = css.replace(/background:\s*rgba\(17,\s*28,\s*24,\s*0\.96\)/g, 'background: var(--bg-panel)');

  // 8. Other neon removal
  css = css.replace(/text-shadow:.*?rgba\(57,\s*255,\s*20[^;]+;/g, '');
  css = css.replace(/background:\s*linear-gradient\([^)]+rgba\(57,\s*255,\s*20[^)]+rgba\(12,\s*23,\s*19[^)]+\);/g, 'background: var(--bg-card);');
  css = css.replace(/background:\s*linear-gradient\([^)]+rgba\(57,\s*255,\s*20[^)]+rgba\(12,\s*23,\s*19[^;]+;/g, 'background: var(--bg-card);');

  // Remove box-shadow glowing outlines
  css = css.replace(/box-shadow:\s*0\s*0\s*0\s*1px\s*rgba\(57,\s*255,\s*20[^;]+;/g, 'box-shadow: none;');
  css = css.replace(/box-shadow:\s*0\s*0\s*0\s*4px\s*rgba\(57,\s*255,\s*20[^;]+;/g, 'box-shadow: none;');

  // Remove the shadow block on btn primary hover
  css = css.replace(/box-shadow:\s*0\s*0\s*0\s*1px\s*rgba\(57,\s*255,\s*20.*?;/g, '');

  fs.writeFileSync(cssPath, css);
  console.log('Done App.css');
} catch (e) {
  console.error(e);
  process.exit(1);
}
