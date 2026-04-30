const AppLoadingState = ({
  title = 'Loading workspace',
  message = 'Pulling together your latest financial data...'
}) => {
  return (
    <div className="app-loading-shell" role="status" aria-live="polite">
      <div className="app-loading-card">
        <div className="spinner"></div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AppLoadingState;
