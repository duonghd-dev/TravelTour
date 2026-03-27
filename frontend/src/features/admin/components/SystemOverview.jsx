import './SystemOverview.scss';

const SystemOverview = () => {
  const metrics = [
    {
      label: 'TOTAL REVENUE',
      value: '$284,590',
      change: '+32%',
      color: '#8c5f3c',
      icon: '💰',
    },
    {
      label: 'ACTIVE ARTISANS',
      value: '1,248',
      change: '+1%',
      color: '#944c3b',
      icon: '👨‍🎨',
    },
    {
      label: 'HERITAGE IMPACT FUND',
      value: '$42,100',
      change: '+12%',
      color: '#9fb96f',
      icon: '🌱',
      highlight: true,
    },
    {
      label: 'TOTAL BOOKINGS',
      value: '3,892',
      change: '-2%',
      color: '#d4a574',
      icon: '📅',
    },
    {
      label: 'ACTIVE TRAVELERS',
      value: '15.2k',
      change: '+18%',
      color: '#8c5f3c',
      icon: '✈️',
    },
  ];

  return (
    <div className="system-overview">
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`metric-card ${metric.highlight ? 'highlight' : ''}`}
            style={{ borderTopColor: metric.color }}
          >
            <div className="metric-icon">{metric.icon}</div>
            <div className="metric-content">
              <div className="metric-label">{metric.label}</div>
              <div className="metric-value">{metric.value}</div>
              <div className="metric-change positive">{metric.change}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemOverview;
