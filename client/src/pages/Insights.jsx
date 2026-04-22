import { useState, useEffect } from 'react';
import { aiService } from '../services/api';
import { toast } from 'react-toastify';
import { FiTrendingUp, FiAlertCircle, FiCheckCircle, FiTarget, FiDollarSign, FiPieChart, FiRefreshCw } from 'react-icons/fi';
import { clampScore, getScoreColor, parseAIInsightsResponse } from '../utils/aiInsights';

const Insights = () => {
  const [insights, setInsights] = useState(null);
  const [budgetSuggestions, setBudgetSuggestions] = useState(null);
  const [savingTips, setSavingTips] = useState(null);
  const [loading, setLoading] = useState({
    insights: true,
    budget: true,
    tips: true
  });
  const [activeTab, setActiveTab] = useState('insights');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    fetchInsights();
    fetchBudgetSuggestions();
    fetchSavingTips();
  };

  const fetchInsights = async () => {
    try {
      setLoading(prev => ({ ...prev, insights: true }));
      const response = await aiService.getInsights();
      setInsights(parseAIInsightsResponse(response.data));
    } catch (error) {
      toast.error('Failed to load insights');
    } finally {
      setLoading(prev => ({ ...prev, insights: false }));
    }
  };

  const fetchBudgetSuggestions = async () => {
    try {
      setLoading(prev => ({ ...prev, budget: true }));
      const response = await aiService.getBudgetSuggestions();
      setBudgetSuggestions(response.data);
    } catch (error) {
      toast.error('Failed to load budget suggestions');
    } finally {
      setLoading(prev => ({ ...prev, budget: false }));
    }
  };

  const fetchSavingTips = async () => {
    try {
      setLoading(prev => ({ ...prev, tips: true }));
      const response = await aiService.getSavingTips();
      setSavingTips(response.data);
    } catch (error) {
      toast.error('Failed to load saving tips');
    } finally {
      setLoading(prev => ({ ...prev, tips: false }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderInsightsTab = () => {
    if (loading.insights) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Analyzing your finances...</p>
        </div>
      );
    }

    if (!insights) {
      return <p className="no-data">No insights available</p>;
    }

    const ecoScore = clampScore(insights.ecoScore);
    const wellbeingScore = clampScore(insights.wellbeingScore);
    const ecoScoreColor = getScoreColor(ecoScore);
    const wellbeingScoreColor = getScoreColor(wellbeingScore);
    const ecoScoreWidth = ecoScore ?? 0;
    const wellbeingScoreWidth = wellbeingScore ?? 0;

    return (
      <div className="insights-content">
        <div className="insight-card health">
          <div className="insight-header">
            <FiTrendingUp className="insight-icon" />
            <h3>Behavior Pattern</h3>
          </div>
          <p>{insights.behavior || 'No behavior pattern returned yet.'}</p>
        </div>

        <div className="insights-grid">
          <div className="insight-card concerns">
            <div className="insight-header">
              <FiAlertCircle className="insight-icon" />
              <h3>Eco Score</h3>
            </div>
            <div className="score-meter" style={{ marginTop: '0.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}
              >
                <span style={{ fontWeight: 700, color: ecoScoreColor }}>
                  {typeof ecoScore === 'number' ? `${ecoScore}%` : 'N/A'}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>{insights.ecoLabel}</span>
              </div>
              <div
                style={{
                  height: '10px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${ecoScoreWidth}%`,
                    height: '100%',
                    borderRadius: '999px',
                    backgroundColor: ecoScoreColor
                  }}
                />
              </div>
            </div>
          </div>

          <div className="insight-card positives">
            <div className="insight-header">
              <FiCheckCircle className="insight-icon" />
              <h3>Wellbeing Score</h3>
            </div>
            <div className="score-meter" style={{ marginTop: '0.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}
              >
                <span style={{ fontWeight: 700, color: wellbeingScoreColor }}>
                  {typeof wellbeingScore === 'number' ? `${wellbeingScore}%` : 'N/A'}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>{insights.wellbeingLabel}</span>
              </div>
              <div
                style={{
                  height: '10px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${wellbeingScoreWidth}%`,
                    height: '100%',
                    borderRadius: '999px',
                    backgroundColor: wellbeingScoreColor
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="insight-card recommendations">
          <div className="insight-header">
            <FiTarget className="insight-icon" />
            <h3>Honest Insight</h3>
          </div>
          <p>{insights.insight || insights.rawText || 'Add more transactions to get personalized recommendations.'}</p>
        </div>

        {insights.suggestions?.length > 0 && (
          <div className="insight-card recommendations">
            <div className="insight-header">
              <FiTarget className="insight-icon" />
              <h3>Suggestions</h3>
            </div>
            <ul>
              {insights.suggestions.map((suggestion, index) => (
                <li key={`${suggestion}-${index}`}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderBudgetTab = () => {
    if (loading.budget) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Calculating budget suggestions...</p>
        </div>
      );
    }

    if (!budgetSuggestions) {
      return <p className="no-data">No budget suggestions available</p>;
    }

    const { suggestions, currentSpending } = budgetSuggestions;

    return (
      <div className="budget-content">
        <div className="budget-summary">
          <div className="summary-card">
            <FiDollarSign className="summary-icon" />
            <div>
              <h4>Recommended Savings</h4>
              <p className="summary-value">{formatCurrency(suggestions.savingsTarget || 0)}/month</p>
            </div>
          </div>
        </div>

        <div className="budget-section">
          <h3>Suggested Category Budgets</h3>
          <div className="budget-grid">
            {suggestions.categoryBudgets && Object.entries(suggestions.categoryBudgets).map(([category, amount]) => (
              <div key={category} className="budget-item">
                <span className="budget-category">{category}</span>
                <span className="budget-amount">{formatCurrency(amount)}</span>
                {currentSpending?.byCategory?.[category] && (
                  <span className={`budget-diff ${currentSpending.byCategory[category] > amount ? 'over' : 'under'}`}>
                    Current: {formatCurrency(currentSpending.byCategory[category])}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {suggestions.reductionAreas?.length > 0 && (
          <div className="budget-section">
            <h3>Areas to Reduce Spending</h3>
            <div className="reduction-list">
              {suggestions.reductionAreas.map((area, index) => (
                <div key={index} className="reduction-item">
                  <FiAlertCircle />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {suggestions.tips?.length > 0 && (
          <div className="budget-section">
            <h3>Budget Tips</h3>
            <ul className="tips-list">
              {suggestions.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderTipsTab = () => {
    if (loading.tips) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Generating saving tips...</p>
        </div>
      );
    }

    if (!savingTips) {
      return <p className="no-data">No saving tips available</p>;
    }

    const { tips, topSpendingCategories } = savingTips;

    return (
      <div className="tips-content">
        {topSpendingCategories?.length > 0 && (
          <div className="spending-overview">
            <h3>Your Top Spending Categories</h3>
            <div className="spending-bars">
              {topSpendingCategories.map(([category, amount], index) => (
                <div key={category} className="spending-bar-item">
                  <div className="spending-bar-label">
                    <span>{category}</span>
                    <span>{formatCurrency(amount)}</span>
                  </div>
                  <div className="spending-bar">
                    <div 
                      className="spending-bar-fill"
                      style={{ 
                        width: `${(amount / topSpendingCategories[0][1]) * 100}%`,
                        backgroundColor: `hsl(${index * 40}, 70%, 50%)`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="tips-section">
          <h3>Personalized Saving Tips</h3>
          <div className="tips-grid">
            {tips?.map((tip, index) => (
              <div key={index} className="tip-card">
                <div className="tip-number">{index + 1}</div>
                <p>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="insights-page">
      <div className="page-header">
        <div>
          <h1>AI Financial Insights</h1>
          <p>Smart analysis and recommendations for your finances</p>
        </div>
        <button className="btn btn-outline" onClick={fetchAllData}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      <div className="insights-tabs">
        <button
          className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          <FiPieChart /> Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveTab('budget')}
        >
          <FiDollarSign /> Budget
        </button>
        <button
          className={`tab-btn ${activeTab === 'tips' ? 'active' : ''}`}
          onClick={() => setActiveTab('tips')}
        >
          <FiTarget /> Saving Tips
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'insights' && renderInsightsTab()}
        {activeTab === 'budget' && renderBudgetTab()}
        {activeTab === 'tips' && renderTipsTab()}
      </div>
    </div>
  );
};

export default Insights;
