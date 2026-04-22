import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiLogIn, FiUser, FiUserPlus, FiX } from 'react-icons/fi';
import { getApiErrorMessage } from '../services/api';

const AuthModal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const modalType = searchParams.get('modal');
  const isOpen = modalType === 'login' || modalType === 'register';

  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Clear form when opening/closing or switching tabs
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setConfirmPassword('');
      // We don't clear email/name immediately to allow seamless switching
    }
  }, [modalType, isOpen]);

  if (!isOpen) return null;

  const isLogin = modalType === 'login';

  const handleClose = () => {
    searchParams.delete('modal');
    setSearchParams(searchParams);
  };

  const handleSwitchMode = () => {
    searchParams.set('modal', isLogin ? 'register' : 'login');
    setSearchParams(searchParams);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin) {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Welcome back!');
      } else {
        await register(name, email, password);
        toast.success('Account created successfully!');
      }
      handleClose();
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Invalid username or password');
      } else {
        toast.error(getApiErrorMessage(error, isLogin ? 'Login failed' : 'Registration failed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={handleClose}>
      <div 
        className="modal" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '440px', 
          backgroundColor: 'var(--bg-card)', 
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-hover)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 1rem 0' }}>
          <button className="btn-icon" onClick={handleClose}>
            <FiX />
          </button>
        </div>

        <div style={{ padding: '0 2rem 2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              {isLogin ? 'Sign in to manage your finances' : 'Start managing your finances today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!isLogin && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="name" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-soft)', marginBottom: '0.4rem' }}>
                  <FiUser /> Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'var(--text)' }}
                />
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="email" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-soft)', marginBottom: '0.4rem' }}>
                <FiMail /> Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'var(--text)' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="password" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-soft)', marginBottom: '0.4rem' }}>
                <FiLock /> Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                required
                minLength={!isLogin ? 6 : undefined}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'var(--text)' }}
              />
            </div>

            {!isLogin && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="confirmPassword" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-soft)', marginBottom: '0.4rem' }}>
                  <FiLock /> Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'var(--text)' }}
                />
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
            >
              {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : (
                <>
                  {isLogin ? <FiLogIn /> : <FiUserPlus />} 
                  {isLogin ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {isLogin ? (
              <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); handleSwitchMode(); }} style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign up</a></p>
            ) : (
              <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); handleSwitchMode(); }} style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in</a></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
