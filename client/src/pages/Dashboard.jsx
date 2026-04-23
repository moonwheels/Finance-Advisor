import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Heart,
  Leaf,
  Repeat,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { getAIInsights, transactionService } from '../services/api';
import { clampScore, getScoreColor, parseAIInsightsResponse } from '../utils/aiInsights';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiData, setAIData] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAIError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAI = async () => {
      try {
        setLoadingAI(true);
        setAIError(false);
        const res = await getAIInsights();
        setAIData(parseAIInsightsResponse(res.data));
      } catch (error) {
        console.error('AI fetch error:', error);
        setAIError(true);
      } finally {
        setLoadingAI(false);
      }
    };

    fetchAI();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, transactionsRes] = await Promise.all([
        transactionService.getStats(),
        transactionService.getAll({ limit: 7 })
      ]);

      setStats(statsRes.data);
      setRecentTransactions(transactionsRes.data.transactions);
    } catch {
      toast.error('Failed to load dashboard data');
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
      <div className="loading-container">
        <div>
          <div className="spinner"></div>
          <p>Loading your finance workspace...</p>
        </div>
      </div>
    );
  }

  const summary = stats?.summary || {};
  const balance = summary.netSavings || 0;
  const ecoScore = clampScore(aiData?.ecoScore) ?? 50;
  const wellbeingScore = clampScore(aiData?.wellbeingScore) ?? 50;
  const ecoScoreColor = getScoreColor(ecoScore);
  const wellbeingScoreColor = getScoreColor(wellbeingScore);
  const expenseCategories = (stats?.categoryStats || [])
    .filter((entry) => entry._id.type === 'expense')
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Finance Dashboard</h1>
          <p>Track your balance, spending momentum, and AI-driven behavior signals from one desktop workspace.</p>
        </div>

        <div className="dashboard-pill">
          <Sparkles size={16} />
          <span>AI live</span>
        </div>
      </div>

      <section className="dashboard-hero-card">
        <div className="dashboard-hero-top">
          <div>
            <div className="dashboard-hero-label">Available balance</div>
            <div className="dashboard-balance-value">{formatCurrency(balance)}</div>
            <div className="dashboard-balance-note">
              {summary.savingsRate || 0}% savings rate with {recentTransactions.length} recent transactions loaded.
            </div>
          </div>

          <div className="dashboard-pill">
            <Wallet size={16} />
            <span>Web workspace</span>
          </div>
        </div>
      </section>

      <section className="dashboard-actions">
        <Link to="/transactions" className="dashboard-action-card" style={{ backgroundColor: '#22c55e', color: '#ffffff', borderColor: '#22c55e' }}>
          <span className="dashboard-action-icon" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}>
            <ArrowDownLeft size={20} />
          </span>
          <span className="dashboard-action-copy">
            <strong style={{ color: '#ffffff' }}>Add Income</strong>
            <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Record a deposit or paycheck</span>
          </span>
        </Link>

        <Link to="/transactions" className="dashboard-action-card" style={{ backgroundColor: '#111827', color: '#ffffff', borderColor: '#111827' }}>
          <span className="dashboard-action-icon" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }}>
            <ArrowUpRight size={20} />
          </span>
          <span className="dashboard-action-copy">
            <strong style={{ color: '#ffffff' }}>Add Expense</strong>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Capture daily spend fast</span>
          </span>
        </Link>

        <Link to="/transactions" className="dashboard-action-card" style={{ backgroundColor: '#a3e635', color: '#000000', borderColor: '#a3e635' }}>
          <span className="dashboard-action-icon" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', color: '#000000' }}>
            <Repeat size={20} />
          </span>
          <span className="dashboard-action-copy">
            <strong style={{ color: '#000000' }}>Manage Ledger</strong>
            <span style={{ color: 'rgba(0, 0, 0, 0.7)' }}>Review, edit, and upload CSV</span>
          </span>
        </Link>
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <section className="dashboard-metrics">
            <article className="dashboard-panel">
              <div className="dashboard-stat-label">Total income</div>
              <div className="dashboard-stat-value">{formatCurrency(summary.totalIncome)}</div>
              <div className="dashboard-stat-note">
                <TrendingUp size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle', color: '#86efac' }} />
                Cash flowing into the account
              </div>
            </article>

            <article className="dashboard-panel">
              <div className="dashboard-stat-label">Total expenses</div>
              <div className="dashboard-stat-value">{formatCurrency(summary.totalExpenses)}</div>
              <div className="dashboard-stat-note">
                <TrendingDown size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle', color: '#fda4af' }} />
                Current outgoing volume
              </div>
            </article>

            <article className="dashboard-panel">
              <div className="dashboard-stat-label">Savings rate</div>
              <div className="dashboard-stat-value">{summary.savingsRate || 0}%</div>
              <div className="dashboard-stat-note">Based on tracked income versus expenses</div>
            </article>
          </section>

          <section className="dashboard-panel">
            <div className="page-header" style={{ marginBottom: '0.5rem' }}>
              <div>
                <h1 style={{ fontSize: '1.55rem', marginBottom: '0.25rem' }}>AI Insights</h1>
                <p>Strict analysis of behavior, eco impact, and wellbeing.</p>
              </div>
            </div>

            {loadingAI ? (
              <div className="dashboard-advice">
                <strong>Analyzing your spending</strong>
                <span>OpenAI is reviewing your latest transaction behavior.</span>
              </div>
            ) : aiError ? (
              <div className="dashboard-advice">
                <strong>AI insights unavailable</strong>
                <span>The dashboard could not load your latest AI response.</span>
              </div>
            ) : (
              <>
                <div className="dashboard-ai-grid">
                  <div className="dashboard-ai-score">
                    <div className="dashboard-ai-score-label">Behavior</div>
                    <div className="dashboard-ai-score-value" style={{ color: '#16a34a' }}>
                      {aiData?.behavior || 'Unknown'}
                    </div>
                    <div className="dashboard-row-subtitle">Current pattern detected from your recent transactions</div>
                  </div>

                  <div className="dashboard-ai-score">
                    <div className="dashboard-ai-score-label">Eco score</div>
                    <div className="dashboard-ai-score-value" style={{ color: ecoScoreColor }}>
                      {ecoScore}
                    </div>
                    <div className="dashboard-row-subtitle">
                      <Leaf size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                      {aiData?.ecoLabel || 'Environmental impact'}
                    </div>
                    <div className="dashboard-progress">
                      <div
                        className="dashboard-progress-bar"
                        style={{ width: `${ecoScore}%`, backgroundColor: ecoScoreColor }}
                      />
                    </div>
                  </div>

                  <div className="dashboard-ai-score">
                    <div className="dashboard-ai-score-label">Wellbeing score</div>
                    <div className="dashboard-ai-score-value" style={{ color: wellbeingScoreColor }}>
                      {wellbeingScore}
                    </div>
                    <div className="dashboard-row-subtitle">
                      <Heart size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                      {aiData?.wellbeingLabel || 'Lifestyle impact'}
                    </div>
                    <div className="dashboard-progress">
                      <div
                        className="dashboard-progress-bar"
                        style={{ width: `${wellbeingScore}%`, backgroundColor: wellbeingScoreColor }}
                      />
                    </div>
                  </div>
                </div>

                <div className="dashboard-advice">
                  <strong>Advice</strong>
                  <span>{aiData?.insight || 'No AI advice available right now.'}</span>
                </div>

                {aiData?.suggestions?.length > 0 && (
                  <ul className="dashboard-suggestions">
                    {aiData.suggestions.map((suggestion, index) => (
                      <li key={`${suggestion}-${index}`}>{suggestion}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </section>

          <section className="dashboard-panel">
            <div className="page-header" style={{ marginBottom: '0.75rem' }}>
              <div>
                <h1 style={{ fontSize: '1.55rem', marginBottom: '0.25rem' }}>Recent Transactions</h1>
                <p>Your latest ledger activity, refreshed from the API.</p>
              </div>
              <Link to="/transactions" className="btn btn-outline">Open Ledger</Link>
            </div>

            {recentTransactions.length > 0 ? (
              <div className="dashboard-list">
                {recentTransactions.map((transaction) => (
                  <div key={transaction._id} className="dashboard-row">
                    <div className="dashboard-row-main">
                      <div className="dashboard-row-title">{transaction.description}</div>
                      <div className="dashboard-row-subtitle">{transaction.category}</div>
                    </div>

                    <div className="dashboard-row-value">
                      <strong style={{ color: transaction.type === 'income' ? '#86efac' : '#fda4af' }}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </strong>
                      <span>{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div>
                  <strong style={{ display: 'block', color: 'var(--text)', marginBottom: '0.4rem' }}>
                    No transactions yet
                  </strong>
                  <span>Add your first transaction to populate the desktop dashboard.</span>
                </div>
              </div>
            )}
          </section>
        </div>

        <aside className="dashboard-side">
          <section className="dashboard-panel">
            <div className="dashboard-stat-label">Financial pulse</div>
            <div className="dashboard-mini-list">
              <div className="dashboard-mini-item">
                <span>Net savings</span>
                <strong>{formatCurrency(summary.netSavings)}</strong>
              </div>
              <div className="dashboard-mini-item">
                <span>Income tracked</span>
                <strong>{formatCurrency(summary.totalIncome)}</strong>
              </div>
              <div className="dashboard-mini-item">
                <span>Expenses tracked</span>
                <strong>{formatCurrency(summary.totalExpenses)}</strong>
              </div>
              <div className="dashboard-mini-item">
                <span>Savings rate</span>
                <strong>{summary.savingsRate || 0}%</strong>
              </div>
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-stat-label">Top expense categories</div>
            {expenseCategories.length > 0 ? (
              <div className="dashboard-mini-list">
                {expenseCategories.map((entry) => (
                  <div key={entry._id.category} className="dashboard-mini-item">
                    <span>{entry._id.category}</span>
                    <strong>{formatCurrency(entry.total)}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-advice" style={{ marginTop: '1rem' }}>
                <strong>No category data yet</strong>
                <span>Add expenses to surface your highest spending buckets.</span>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
