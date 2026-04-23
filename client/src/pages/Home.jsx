import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiPieChart, FiUpload, FiShield, FiDollarSign, FiTarget } from 'react-icons/fi';

const CountUp = ({ end, duration = 1500, prefix = "$" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{prefix}{count.toLocaleString()}</span>;
};

const Home = () => {
  return (
    <div className='home-page animate-fade-in'>
      <section className='hero'>
        <div className='hero-content'>
          <h1>Take Control of Your <span className='highlight-gradient'>Finances</span></h1>
          <p className="hero-subtitle">
            Track spending, save smarter, and grow your money with AI-powered insights.
          </p>
          
          <div className='hero-actions'>
            <div className='hero-buttons'>
              <Link to='/?modal=register' className='btn btn-primary btn-lg btn-glow'>
                Get Started Free
              </Link>
              <Link to='/?modal=login' className='btn btn-outline btn-lg'>
                Sign In
              </Link>
            </div>
            <div className="hero-microcopy">
              <span>No credit card required</span>
            </div>
            <div className="trust-badge">
              <span>Trusted by 10,000+ users</span>
            </div>
          </div>
        </div>

        <div className='hero-visual'>
          <div className='dashboard-preview'>
            <div className='preview-card preview-card-income'>
              <div className="preview-icon-wrapper income-wrapper">
                <FiTrendingUp className='preview-icon income' />
              </div>
              <div className="preview-info">
                <span>Income</span>
                <strong><CountUp end={5240} /></strong>
              </div>
            </div>

            <div className='preview-card preview-card-expense'>
              <div className="preview-icon-wrapper expense-wrapper">
                <FiPieChart className='preview-icon expense' />
              </div>
              <div className="preview-info">
                <span>Expenses</span>
                <strong><CountUp end={3180} /></strong>
              </div>
            </div>

            <div className='preview-card preview-card-savings'>
              <div className="preview-icon-wrapper savings-wrapper">
                <FiDollarSign className='preview-icon savings' />
              </div>
              <div className="preview-info">
                <span>Savings</span>
                <strong><CountUp end={2060} /></strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='features'>
        <h2>Smart Features for Smart Finances</h2>
        <div className='features-grid'>
          <div className='feature-card'>
            <div className='feature-icon'>
              <FiUpload />
            </div>
            <h3>Easy Import</h3>
            <p>Upload CSV bank statements or manually enter transactions. We support multiple formats.</p>
          </div>

          <div className='feature-card'>
            <div className='feature-icon'>
              <FiPieChart />
            </div>
            <h3>Visual Analytics</h3>
            <p>Beautiful charts and graphs to visualize your spending patterns and trends over time.</p>
          </div>

          <div className='feature-card'>
            <div className='feature-icon'>
              <FiTrendingUp />
            </div>
            <h3>AI Insights</h3>
            <p>Get personalized financial advice powered by AI. Understand where your money goes.</p>
          </div>

          <div className='feature-card'>
            <div className='feature-icon'>
              <FiTarget />
            </div>
            <h3>Budget Planning</h3>
            <p>Set budgets and savings goals. Track your progress and stay on target.</p>
          </div>

          <div className='feature-card'>
            <div className='feature-icon'>
              <FiDollarSign />
            </div>
            <h3>Saving Tips</h3>
            <p>Receive customized tips to reduce spending and increase your savings rate.</p>
          </div>

          <div className='feature-card'>
            <div className='feature-icon'>
              <FiShield />
            </div>
            <h3>Secure and Private</h3>
            <p>Your financial data is encrypted and secure. We never share your information.</p>
          </div>
        </div>
      </section>

      <section className='cta'>
        <h2>Ready to Transform Your Finances?</h2>
        <p>Join thousands of users who have taken control of their financial future.</p>
        <Link to='/?modal=register' className='btn btn-primary btn-lg'>
          Start Your Journey
        </Link>
      </section>

      <footer className='home-footer'>
        <p>(c) 2024 SpendSense. Built with MERN Stack and OpenAI.</p>
      </footer>
    </div>
  );
};

export default Home;
