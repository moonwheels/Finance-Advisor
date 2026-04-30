const EmptyStateCard = ({
  title,
  description,
  action
}) => {
  return (
    <div className="empty-state-card">
      <div className="empty-state-illustration" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <strong>{title}</strong>
      <p>{description}</p>
      {action ? <div className="empty-state-action">{action}</div> : null}
    </div>
  );
};

export default EmptyStateCard;
