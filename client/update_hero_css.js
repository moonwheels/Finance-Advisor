const fs = require('fs');
let css = fs.readFileSync('src/App.css', 'utf8');

// Replace hero content h1 rule
css = css.replace(/\.hero-content\s*h1\s*\{[^}]+\}/, `.hero-content h1 {
  font-size: clamp(3.3rem, 6vw, 5.2rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
  color: var(--text);
  font-weight: 800;
  margin-bottom: 1.25rem;
}

.hero-content .highlight-gradient {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #16a34a;
}`);

// Replace highlight
css = css.replace(/\.hero-content\s*\.highlight\s*\{[^}]+\}/, ``);

// Replace hero-content p
css = css.replace(/\.hero-content\s*p\s*\{[^}]+\}/, `.hero-subtitle {
  max-width: 620px;
  font-size: 1.15rem;
  line-height: 1.7;
  color: var(--text-soft);
  margin-bottom: 2.25rem;
}`);

// Replace hero-buttons
css = css.replace(/\.hero-buttons\s*\{[^}]+\}/, `.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.hero-microcopy span {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
}

.trust-badge {
  margin-top: 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-soft);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-glow {
  box-shadow: 0 12px 24px -8px rgba(34, 197, 94, 0.4);
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
  border: none;
  color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.btn-glow:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 16px 32px -8px rgba(34, 197, 94, 0.5);
}`);


css = css.replace(/\.preview-card\s*\{[^}]+\}/g, `.preview-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.25rem;
  align-items: center;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-soft);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
  animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.preview-card:hover {
  transform: translateX(-4px) translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.preview-card:nth-child(1) { animation-delay: 0.2s; }
.preview-card:nth-child(2) { animation-delay: 0.3s; }
.preview-card:nth-child(3) { animation-delay: 0.4s; }

.preview-card-income { background: rgba(220, 252, 231, 0.4); border-color: rgba(34, 197, 94, 0.2); }
.preview-card-expense { background: rgba(254, 226, 226, 0.4); border-color: rgba(239, 68, 68, 0.2); }
.preview-card-savings { background: rgba(219, 234, 254, 0.4); border-color: rgba(59, 130, 246, 0.2); }`);


css = css.replace(/\.preview-icon\s*\{[^}]+\}/, `.preview-icon-wrapper {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.income-wrapper { background: #dcfce7; color: #16a34a; }
.expense-wrapper { background: #fee2e2; color: #ef4444; }
.savings-wrapper { background: #dbeafe; color: #2563eb; }

.preview-icon {
  font-size: 1.4rem;
}`);

css = css.replace(/\.preview-card\s*span\s*\{[^}]+\}/, `.preview-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.preview-info span {
  color: var(--text-muted);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}`);

css = css.replace(/\.preview-card\s*strong\s*\{[^}]+\}/, `.preview-info strong {
  font-size: 1.35rem;
  color: var(--text);
  font-weight: 800;
}`);

fs.writeFileSync('src/App.css', css);
