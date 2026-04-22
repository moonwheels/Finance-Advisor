import re
import sys
import traceback

try:
    with open('src/App.css', 'r', encoding='utf-8') as f:
        css = f.read()

    # 1. Variables
    css = re.sub(r':root\s*\{.*?(?=\})', r''':root {
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
  --shadow-soft: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #3b82f6;
  --radius-lg: 1rem;
  --radius-md: 1rem;
  --radius-sm: 0.5rem;
  --content-width: 1380px;
''', css, flags=re.DOTALL)

    # 2. Body background
    css = re.sub(r'background:\s*radial-gradient\([^;]+;', 'background: var(--bg-app);', css)

    # 3. Button primary background & shadow
    css = re.sub(r'background:\s*linear-gradient\(135deg.*?;', 'background: var(--accent);', css)
    css = re.sub(r'box-shadow:\s*0\s*0\s*0\s*1px\s*rgba\(57,\s*255,\s*20.*?;', 'box-shadow: none;', css)
    css = re.sub(r'box-shadow:\s*0\s*0\s*0\s*4px\s*rgba\(57,\s*255,\s*20.*?;', 'box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);', css)

    # 4. Hardcoded RGBA Backgrounds
    css = re.sub(r'rgba\(12,\s*23,\s*19,\s*0\.[\d]+\)', 'var(--bg-card)', css)
    css = re.sub(r'rgba\(4,\s*11,\s*9,\s*0\.[\d]+\)', 'var(--bg-card-strong)', css)
    css = re.sub(r'rgba\(8,\s*17,\s*14,\s*0\.[\d]+\)', 'var(--bg-app)', css)
    css = re.sub(r'rgba\(17,\s*28,\s*24,\s*0\.[\d]+\)', 'var(--bg-panel)', css)

    # Hover effects for neon -> gray
    css = re.sub(r'rgba\(255,\s*255,\s*255,\s*0\.0[2-8]\)', 'var(--bg-card-strong)', css)
    css = re.sub(r'rgba\(255,\s*255,\s*255,\s*0\.1\d\)', 'var(--border)', css)

    # 5. Neon shadows & text shadows
    css = re.sub(r'text-shadow:\s*0\s*0\s*\d+px\s*rgba\(57,\s*255,\s*20,\s*0\.[\d]+\);', 'text-shadow: none;', css)

    # 6. Buttons
    css = re.sub(r'color:\s*#021106;', 'color: #ffffff;', css)
    css = re.sub(r'background:\s*#021106;', 'background: #ffffff;', css)

    # 7. Borders
    css = re.sub(r'border:\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.0\d+\)', 'border: 1px solid var(--border)', css)
    css = re.sub(r'border-(bottom|top|left|right):\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.0\d+\)', r'border-\1: 1px solid var(--border)', css)

    css = re.sub(r'border-color:\s*rgba\(57,\s*255,\s*20,\s*0\.[\d]+\)', 'border-color: var(--border-strong)', css)

    # 8. Category colors
    # The prompt: Deposit: bg-green-500 text-white (Wait, Button colors handled in components? Let's fix Dashboard)

    with open('src/App.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print("CSS updated successfully")

except Exception as e:
    print("ERROR:")
    traceback.print_exc()
    sys.exit(1)
