import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ExpenseAnalytics from '../components/ExpenseAnalytics';
import { transactionService } from '../services/api';

const ExpenseAnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [statsRes, transactionsRes] = await Promise.all([
        transactionService.getStats(),
        transactionService.getAll({ limit: 8 })
      ]);

      setStats(statsRes.data);
      setRecentTransactions(transactionsRes.data.transactions);
    } catch {
      toast.error('Failed to load expense analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="insights-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading expense analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="insights-page">
      <div className="page-header">
        <div>
          <h1>Expense Analytics</h1>
          <p>Track monthly spending, category distribution, and recent ledger activity in one focused view.</p>
        </div>

        <div className="header-actions">
          <Link to="/transactions" className="btn btn-outline">
            <FiBarChart2 /> Open Transactions
          </Link>
          <button className="btn btn-primary" onClick={fetchAnalytics}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      <ExpenseAnalytics
        stats={stats}
        recentTransactions={recentTransactions}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
    </div>
  );
};

export default ExpenseAnalyticsPage;
