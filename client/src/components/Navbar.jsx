import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeftRight,
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  UserRound,
  X
} from 'lucide-react';

const publicShellStyles = `
  body {
    background: var(--bg-app) !important;
    color: var(--text);
  }

  .main-content {
    min-height: 100vh;
    padding: 108px 40px 48px !important;
    margin-left: 0 !important;
    background: var(--bg-app);
  }

  .neon-public-shell {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 78px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0 40px;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(18px);
    z-index: 1200;
  }

  .neon-public-brand {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--text);
    text-decoration: none;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .neon-public-brand-badge {
    width: 2.25rem;
    height: 2.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: var(--accent-soft);
    color: var(--accent);
    box-shadow: 0 0 0 1px var(--bg-card);
  }

  .neon-public-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .neon-public-link {
    padding: 0.75rem 1rem;
    border-radius: 0.9rem;
    border: 1px solid var(--border);
    color: var(--text-soft);
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .neon-public-link.primary {
    background: var(--accent);
    border-color: var(--accent);
    color: #ffffff;
    font-weight: 700;
    box-shadow: 0 18px 28px var(--bg-card);
  }

  .neon-public-link:hover {
    transform: translateY(-2px);
  }
`;

const authShellStyles = `
  body {
    background: var(--bg-app) !important;
    color: var(--text);
  }

  .app {
    background: var(--bg-app);
  }

  .main-content {
    min-height: 100vh;
    background: var(--bg-app);
  }

  .neon-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 286px;
    padding: 1.6rem 1.15rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background: #ffffff;
    border-right: 1px solid var(--border);
    z-index: 1300;
  }

  .neon-sidebar-brand {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 0.75rem 0.65rem 1rem;
    border-bottom: 1px solid var(--border);
  }

  .neon-sidebar-brand-icon {
    width: 2.7rem;
    height: 2.7rem;
    border-radius: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--accent-soft);
    color: var(--accent);
    box-shadow: 0 0 0 1px var(--bg-card);
  }

  .neon-sidebar-brand-copy {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .neon-sidebar-brand-copy strong {
    font-size: 1.05rem;
    color: var(--text);
    letter-spacing: 0.02em;
  }

  .neon-sidebar-brand-copy span {
    color: var(--text-muted);
    font-size: 0.82rem;
  }

  .neon-sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .neon-sidebar-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.95rem 1rem;
    border-radius: 0.5rem;
    color: #4b5563;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .neon-sidebar-link-left {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
  }

  .neon-sidebar-link:hover {
    color: #1f2937;
    background: #f3f4f6;
    transform: translateX(4px);
  }

  .neon-sidebar-link.active {
    background: #22c55e;
    color: #ffffff;
    font-weight: 600;
    box-shadow: none;
    transform: none;
  }

  .neon-sidebar-user {
    margin-top: auto;
    padding: 1rem;
    border-radius: 1.25rem;
    background: var(--bg-card-strong);
    border: 1px solid var(--border);
  }

  .neon-sidebar-user-label {
    color: var(--text-muted);
    font-size: 0.76rem;
    margin-bottom: 0.35rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .neon-sidebar-user-name {
    color: var(--text);
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .neon-sidebar-logout {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.55rem;
    padding: 0.85rem 1rem;
    border-radius: 0.75rem;
    border: 1px solid var(--border-strong);
    background: #f3f4f6;
    color: #374151;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .neon-sidebar-logout:hover {
    color: var(--danger);
    background: #fee2e2;
    border-color: #fca5a5;
  }

  .neon-mobile-header {
    display: none;
  }

  @media (min-width: 1025px) {
    .main-content {
      margin-left: 286px !important;
      padding: 40px 40px 56px !important;
    }
  }

  @media (max-width: 1024px) {
    .main-content {
      margin-left: 0 !important;
      padding: 96px 18px 28px !important;
    }

    .neon-mobile-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 72px;
      padding: 0 1.1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--bg-card);
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(14px);
      z-index: 1400;
    }

    .neon-mobile-brand {
      display: inline-flex;
      align-items: center;
      gap: 0.7rem;
      color: var(--text);
      text-decoration: none;
      font-weight: 700;
    }

    .neon-mobile-brand-badge {
      width: 2.15rem;
      height: 2.15rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: var(--accent-soft);
      color: var(--accent);
      box-shadow: 0 0 0 1px var(--bg-card);
    }

    .neon-mobile-trigger {
      width: 2.7rem;
      height: 2.7rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--accent);
      cursor: pointer;
    }

    .neon-sidebar {
      transform: translateX(-105%);
      transition: transform 0.32s ease;
      width: min(82vw, 320px);
      box-shadow: 24px 0 40px var(--bg-card);
    }

    .neon-sidebar.open {
      transform: translateX(0);
    }

    .neon-sidebar-overlay {
      position: fixed;
      inset: 0;
      background: var(--bg-card);
      backdrop-filter: blur(4px);
      z-index: 1295;
    }
  }
`;

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
    { path: '/insights', label: 'AI Insights', icon: Sparkles },
    { path: '/profile', label: 'Profile', icon: UserRound }
  ];

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated) {
    return (
      <>
        <style>{publicShellStyles}</style>
        <header className="neon-public-shell">
          <Link to="/" className="neon-public-brand">
            <span className="neon-public-brand-badge">
              <CircleDollarSign size={18} />
            </span>
            <span>FinanceAI</span>
          </Link>

          <div className="neon-public-actions">
            <Link to="/?modal=login" className="neon-public-link">Login</Link>
            <Link to="/?modal=register" className="neon-public-link primary">Get Started</Link>
          </div>
        </header>
      </>
    );
  }

  return (
    <>
      <style>{authShellStyles}</style>

      <header className="neon-mobile-header">
        <Link to="/dashboard" className="neon-mobile-brand">
          <span className="neon-mobile-brand-badge">
            <CircleDollarSign size={18} />
          </span>
          <span>FinanceAI</span>
        </Link>

        <button
          className="neon-mobile-trigger"
          onClick={() => setMobileMenuOpen((current) => !current)}
          aria-label="Toggle sidebar"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {mobileMenuOpen && <div className="neon-sidebar-overlay" onClick={() => setMobileMenuOpen(false)} />}

      <aside className={`neon-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="neon-sidebar-brand">
          <span className="neon-sidebar-brand-icon">
            <CircleDollarSign size={18} />
          </span>
          <div className="neon-sidebar-brand-copy">
            <strong>FinanceAI</strong>
            <span>Neon Wealth Console</span>
          </div>
        </div>

        <nav className="neon-sidebar-nav">
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`neon-sidebar-link ${isActive(path) ? 'active' : ''}`}
            >
              <span className="neon-sidebar-link-left">
                <Icon size={18} />
                <span>{label}</span>
              </span>
            </Link>
          ))}
        </nav>

        <div className="neon-sidebar-user">
          <div className="neon-sidebar-user-label">Logged In</div>
          <div className="neon-sidebar-user-name">{user?.name || 'Finance User'}</div>
          <button onClick={handleLogout} className="neon-sidebar-logout">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
