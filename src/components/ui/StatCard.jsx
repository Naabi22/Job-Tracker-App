function StatCard({ label, value, sub, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <strong className="stat-value">{value}</strong>
      <span className="stat-sub">{sub}</span>
    </div>
  );
}

export default StatCard;
