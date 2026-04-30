import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiDollarSign, FiTarget, FiSave, FiLock } from 'react-icons/fi';
import EmptyStateCard from '../components/EmptyStateCard';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    monthlyBudget: '',
    savingsGoal: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        monthlyBudget: user.monthlyBudget || '',
        savingsGoal: user.savingsGoal || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.updateProfile({
        name: formData.name,
        email: formData.email,
        monthlyBudget: parseFloat(formData.monthlyBudget) || 0,
        savingsGoal: parseFloat(formData.savingsGoal) || 0
      });

      updateUser(response.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await authService.updateProfile({
        currentPassword: passwordData.currentPassword,
        password: passwordData.newPassword
      });

      toast.success('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <div>
          <h1>Profile Settings</h1>
          <p>Manage your account details, budgets, and password from one clean workspace.</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h2>Personal Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                <FiUser /> Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FiMail /> Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="profile-card">
          <h2>Financial Goals</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                <FiDollarSign /> Monthly Budget
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={formData.monthlyBudget}
                onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value })}
                placeholder="e.g., 3000"
              />
              <span className="form-hint">
                Set your target monthly spending limit
              </span>
            </div>

            <div className="form-group">
              <label>
                <FiTarget /> Savings Goal
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={formData.savingsGoal}
                onChange={(e) => setFormData({ ...formData, savingsGoal: e.target.value })}
                placeholder="e.g., 10000"
              />
              <span className="form-hint">
                Your target savings amount
              </span>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FiSave /> {loading ? 'Saving...' : 'Update Goals'}
            </button>
          </form>
        </div>

        <div className="profile-card">
          <h2>Security</h2>
          {!showPasswordForm ? (
            <EmptyStateCard
              title="Keep your account secure"
              description="Update your password regularly to protect your financial data."
              action={
                <button
                  className="btn btn-outline"
                  onClick={() => setShowPasswordForm(true)}
                >
                  <FiLock /> Change Password
                </button>
              }
            />
          ) : (
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  required
                  minLength={8}
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="button-group">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="profile-card summary">
          <h2>Account Summary</h2>
          <div className="summary-items">
            <div className="summary-item">
              <span className="summary-label">Member Since</span>
              <span className="summary-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Monthly Budget</span>
              <span className="summary-value">
                {formData.monthlyBudget ? formatCurrency(formData.monthlyBudget) : 'Not set'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Savings Goal</span>
              <span className="summary-value">
                {formData.savingsGoal ? formatCurrency(formData.savingsGoal) : 'Not set'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
