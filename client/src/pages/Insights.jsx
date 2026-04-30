import { useState, useEffect } from 'react';
import { aiService } from '../services/api';
import { toast } from 'react-toastify';
import { FiTrendingUp, FiAlertCircle, FiCheckCircle, FiTarget, FiDollarSign, FiPieChart, FiRefreshCw } from 'react-icons/fi';
import { clampScore, parseAIInsightsResponse } from '../utils/aiInsights';
import AppLoadingState from '../components/AppLoadingState';
import EmptyStateCard from '../components/EmptyStateCard';

const INITIAL_LOADING_STATE = {
  insights: false,
  budget: false,
  tips: false
};

const Insights = () => {
  const [insights, setInsights] = useState(null);
  const [budgetSuggestions, setBudgetSuggestions] = useState(null);
  const [savingTips, setSavingTips] = useState(null);
  const [loading, setLoading] = useState(INITIAL_LOADING_STATE);
  const [activeTab, setActiveTab] = useState('insights');

  useEffect(() => {
    if (activeTab === 'insights' && !insights && !loading.insights) {
      fetchInsights();
    }

    if (activeTab === 'budget' && !budgetSuggestions && !loading.budget) {
      fetchBudgetSuggestions();
    }

    if (activeTab === 'tips' && !savingTips && !loading.tips) {
      fetchSavingTips();
    }
  }, [activeTab, insights, budgetSuggestions, savingTips, loading.insights, loading.budget, loading.tips]);

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

  const handleRefresh = () => {
    if (activeTab === 'insights') {
      fetchInsights();
      return;
    }

    if (activeTab === 'budget') {
      fetchBudgetSuggestions();
      return;
    }

    fetchSavingTips();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getEcoScoreClass = (score) => {
    if (typeof score !== 'number') return 'score-value neutral';
    if (score < 40) return 'score-value eco low';
    if (score < 70) return 'score-value eco medium';
    return 'score-value eco good';
  };

  const getWellbeingScoreClass = (score) => {
    if (typeof score !== 'number') return 'score-value neutral';
    if (score < 60) return 'score-value wellbeing low';
    return 'score-value wellbeing good';
  };

  const renderInsightsTab = () => {
    if (loading.insights) {
      return <AppLoadingState title="Analyzing your finances" message="Generating behavior, eco, and wellbeing insights..." />;
    }

    if (!insights) {
      return (
        <EmptyStateCard
          title="No AI insights available"
          description="Add more transaction history or refresh later to generate stronger financial patterns."
        />
      );
    }

    const ecoScore = clampScore(insights.ecoScore);
    const wellbeingScore = clampScore(insights.wellbeingScore);
    const ecoScoreWidth = ecoScore ?? 0;
    const wellbeingScoreWidth = wellbeingScore ?? 0;

    return (
      <div className="insights-content">
        <div className="insight-card health premium-card insight-emphasis">
          <div className="insight-header">
            <span className="insight-icon-wrap insight-icon-wrap-blue">
              <FiTrendingUp className="insight-icon" />
            </span>
            <h3>Behavior Pattern</h3>
          </div>
          <p>{insights.behavior || 'No behavior pattern returned yet.'}</p>
        </div>

        <div className="insights-grid">
          <div className="insight-card concerns premium-card score-card eco-score-card">
            <div className="insight-header">
              <span className="insight-icon-wrap insight-icon-wrap-green">
                <FiAlertCircle className="insight-icon" />
              </span>
              <h3>Eco Score</h3>
            </div>
            <div className="score-meter" style={{ marginTop: '0.5rem' }}>
              <div className="score-row">
                <span className={getEcoScoreClass(ecoScore)}>
                  {typeof ecoScore === 'number' ? `${ecoScore}%` : 'N/A'}
                </span>
                <span className="score-label">{insights.ecoLabel}</span>
              </div>
              <div className="score-progress-track">
                <div
                  className="score-progress-fill eco"
                  style={{
                    width: `${ecoScoreWidth}%`
                  }}
                />
              </div>
            </div>
          </div>

          <div className="insight-card positives premium-card score-card wellbeing-score-card">
            <div className="insight-header">
              <span className="insight-icon-wrap insight-icon-wrap-orange">
                <FiCheckCircle className="insight-icon" />
              </span>
              <h3>Wellbeing Score</h3>
            </div>
            <div className="score-meter" style={{ marginTop: '0.5rem' }}>
              <div className="score-row">
                <span className={getWellbeingScoreClass(wellbeingScore)}>
                  {typeof wellbeingScore === 'number' ? `${wellbeingScore}%` : 'N/A'}
                </span>
                <span className="score-label">{insights.wellbeingLabel}</span>
              </div>
              <div className="score-progress-track">
                <div
                  className="score-progress-fill wellbeing"
                  style={{
                    width: `${wellbeingScoreWidth}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="insight-card recommendations premium-card insight-card-blue insight-emphasis">
          <div className="insight-header">
            <span className="insight-icon-wrap insight-icon-wrap-blue">
              <FiTarget className="insight-icon" />
            </span>
            <h3>Honest Insight</h3>
          </div>
          <p>{insights.insight || insights.rawText || 'Add more transactions to get personalized recommendations.'}</p>
        </div>

        {insights.suggestions?.length > 0 && (
          <div className="insight-card recommendations premium-card suggestions-card">
            <div className="insight-header">
              <span className="insight-icon-wrap insight-icon-wrap-green">
                <FiTarget className="insight-icon" />
              </span>
              <h3>Suggestions</h3>
            </div>
            <ul>
              {insights.suggestions.map((suggestion, index) => (
                <li key={`${suggestion}-${index}`}>
                  <FiCheckCircle className="suggestion-check" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderBudgetTab = () => {
    if (loading.budget) {
      return <AppLoadingState title="Building budget suggestions" message="Reviewing category totals and spend patterns..." />;
    }

    if (!budgetSuggestions) {
      return (
        <EmptyStateCard
          title="No budget suggestions available"
          description="Budget recommendations will appear once the app has enough transaction context."
        />
      );
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
      return <AppLoadingState title="Generating saving tips" message="Looking for practical ways to improve your savings..." />;
    }

    if (!savingTips) {
      return (
        <EmptyStateCard
          title="No saving tips available"
          description="Try refreshing after you add more transactions to unlock targeted suggestions."
        />
      );
    }

    const { tips, topSpendingCategories } = savingTips;
    const topCategoryAmount = topSpendingCategories?.[0]?.[1] || 0;

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
                        width: `${topCategoryAmount > 0 ? (amount / topCategoryAmount) * 100 : 0}%`,
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
        <button className="btn btn-outline" onClick={handleRefresh}>
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
