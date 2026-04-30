import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORY_COLORS = [
  '#16a34a',
  '#2563eb',
  '#f97316',
  '#dc2626',
  '#7c3aed',
  '#0891b2',
  '#ca8a04'
];

const getMonthlyExpenseSummary = (monthlyTrends = []) => {
  const expenseEntries = monthlyTrends
    .filter((entry) => entry?._id?.type === 'expense')
    .sort((a, b) => {
      if (a._id.year !== b._id.year) {
        return b._id.year - a._id.year;
      }

      return b._id.month - a._id.month;
    });

  if (expenseEntries.length === 0) {
    return {
      label: 'No monthly expense data yet',
      total: 0
    };
  }

  const latestEntry = expenseEntries[0];
  const monthDate = new Date(latestEntry._id.year, latestEntry._id.month - 1, 1);

  return {
    label: monthDate.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric'
    }),
    total: latestEntry.total || 0
  };
};

const ExpenseAnalytics = ({
  stats,
  recentTransactions,
  formatCurrency,
  formatDate
}) => {
  const expenseCategories = (stats?.categoryStats || [])
    .filter((entry) => entry?._id?.type === 'expense')
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  const monthlyExpense = getMonthlyExpenseSummary(stats?.monthlyTrends || []);

  const pieData = {
    labels: expenseCategories.map((entry) => entry._id.category),
    datasets: [
      {
        data: expenseCategories.map((entry) => entry.total),
        backgroundColor: CATEGORY_COLORS.slice(0, expenseCategories.length),
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 10
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          color: '#4b5563',
          padding: 18,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${formatCurrency(context.raw)}`
        }
      }
    },
    cutout: '62%'
  };

  return (
    <section className="dashboard-panel analytics-panel">
      <div className="page-header analytics-header">
        <div>
          <h1 style={{ fontSize: '1.55rem', marginBottom: '0.25rem' }}>Expense Analytics</h1>
          <p>See this month&apos;s outflow, where your money is going, and the latest activity at a glance.</p>
        </div>
      </div>

      <div className="analytics-grid">
        <article className="analytics-highlight-card">
          <span className="analytics-kicker">Monthly spending total</span>
          <strong>{formatCurrency(monthlyExpense.total)}</strong>
          <p>{monthlyExpense.label}</p>
        </article>

        <article className="analytics-highlight-card analytics-highlight-card-soft">
          <span className="analytics-kicker">Transactions loaded</span>
          <strong>{recentTransactions.length}</strong>
          <p>Most recent entries shown in the activity list</p>
        </article>
      </div>

      <div className="analytics-body">
        <div className="analytics-chart-card">
          <div className="analytics-section-head">
            <h3>Category breakdown</h3>
            <span>Expense distribution</span>
          </div>

          {expenseCategories.length > 0 ? (
            <>
              <div className="analytics-chart-wrap">
                <Doughnut data={pieData} options={pieOptions} />
              </div>

              <div className="analytics-category-list">
                {expenseCategories.map((entry, index) => (
                  <div key={entry._id.category} className="analytics-category-row">
                    <span className="analytics-category-name">
                      <span
                        className="analytics-category-dot"
                        style={{ backgroundColor: CATEGORY_COLORS[index] }}
                      />
                      {entry._id.category}
                    </span>
                    <strong>{formatCurrency(entry.total)}</strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div>
                <strong style={{ display: 'block', color: 'var(--text)', marginBottom: '0.4rem' }}>
                  No expense data yet
                </strong>
                <span>Add expense transactions to unlock the category chart.</span>
              </div>
            </div>
          )}
        </div>

        <div className="analytics-transactions-card">
          <div className="analytics-section-head">
            <h3>Recent transactions</h3>
            <span>Latest ledger activity</span>
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
                <span>Add your first transaction to populate the analytics feed.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExpenseAnalytics;
