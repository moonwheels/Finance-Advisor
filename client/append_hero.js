const fs = require('fs');
const overrides = `
/* ======== HERO REDESIGN OVERRIDES ======== */
.hero {
  min-height: calc(100vh - 110px) !important;
  display: grid !important;
  grid-template-columns: minmax(0, 1.2fr) minmax(340px, 0.8fr) !important;
  gap: 2rem !important;
  align-items: center !important;
  padding-top: 4rem !important;
  padding-bottom: 4rem !important;
}

.hero-content h1 {
  font-size: clamp(3.3rem, 6vw, 5.2rem) !important;
  line-height: 1.05 !important;
  letter-spacing: -0.04em !important;
  font-weight: 800 !important;
}

.hero-content .highlight-gradient {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  color: #16a34a !important;
}

.hero-subtitle {
  max-width: 620px !important;
  font-size: 1.15rem !important;
  line-height: 1.7 !important;
  color: var(--text-soft) !important;
  margin-bottom: 2.25rem !important;
}

.hero-actions {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.85rem !important;
}

.hero-microcopy {
  margin-top: 0.25rem;
}

.hero-microcopy span {
  font-size: 0.85rem !important;
  color: var(--text-muted) !important;
  font-weight: 500 !important;
}

.trust-badge {
  margin-top: 1.5rem !important;
  font-size: 0.85rem !important;
  font-weight: 600 !important;
  color: var(--text-soft) !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
}

.btn-glow {
  box-shadow: 0 12px 24px -8px rgba(34, 197, 94, 0.4) !important;
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%) !important;
  border: none !important;
  color: white !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease !important;
}

.btn-glow:hover {
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 16px 32px -8px rgba(34, 197, 94, 0.5) !important;
}

.preview-card {
  display: grid !important;
  grid-template-columns: auto 1fr !important;
  gap: 1.25rem !important;
  padding: 1.5rem !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(12px) !important;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease !important;
  animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both !important;
  border-radius: var(--radius-lg) !important;
  border: 1px solid var(--border) !important;
}

.preview-card:hover {
  transform: translateX(-4px) translateY(-4px) !important;
  box-shadow: var(--shadow-hover) !important;
}

.preview-card:nth-child(1) { animation-delay: 0.2s !important; }
.preview-card:nth-child(2) { animation-delay: 0.3s !important; }
.preview-card:nth-child(3) { animation-delay: 0.4s !important; }

.preview-card-income { background: rgba(220, 252, 231, 0.4) !important; border-color: rgba(34, 197, 94, 0.2) !important; }
.preview-card-expense { background: rgba(254, 226, 226, 0.4) !important; border-color: rgba(239, 68, 68, 0.2) !important; }
.preview-card-savings { background: rgba(219, 234, 254, 0.4) !important; border-color: rgba(59, 130, 246, 0.2) !important; }

.preview-icon-wrapper {
  width: 52px !important;
  height: 52px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 16px !important;
}

.income-wrapper { background: #dcfce7 !important; color: #16a34a !important; }
.expense-wrapper { background: #fee2e2 !important; color: #ef4444 !important; }
.savings-wrapper { background: #dbeafe !important; color: #2563eb !important; }

.preview-info {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.25rem !important;
}

.preview-info span {
  font-size: 0.85rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  font-weight: 600 !important;
}

.preview-info strong {
  font-size: 1.35rem !important;
  font-weight: 800 !important;
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr !important;
    padding-top: 2rem !important;
  }
}
`;
fs.appendFileSync('src/App.css', overrides);
console.log('Appended hero overrides');
