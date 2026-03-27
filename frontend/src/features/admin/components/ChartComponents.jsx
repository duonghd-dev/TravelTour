import React from 'react';
import './ChartComponents.scss';

export const RevenueVsImpact = () => {
  const data = [
    { month: 'Jan', revenue: 65, impact: 45 },
    { month: 'Feb', revenue: 75, impact: 52 },
    { month: 'Mar', revenue: 85, impact: 58 },
    { month: 'Apr', revenue: 70, impact: 48 },
    { month: 'May', revenue: 95, impact: 68 },
    { month: 'Jun', revenue: 88, impact: 65 },
  ];

  const maxValue = 100;

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Revenue vs. Impact</h3>
        <p>Financial growth aligned with cultural preservation</p>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color revenue"></span>
            <span>REVENUE</span>
          </div>
          <div className="legend-item">
            <span className="legend-color impact"></span>
            <span>IMPACT</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <svg viewBox="0 0 600 300" className="bar-chart">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => (
            <line
              key={`grid-${val}`}
              x1="60"
              y1={240 - val * 1.8}
              x2="580"
              y2={240 - val * 1.8}
              className="grid-line"
            />
          ))}

          {/* Y-axis labels */}
          {[100, 75, 50, 25, 0].map((val) => (
            <text
              key={`label-${val}`}
              x="30"
              y={243 - val * 1.8}
              className="axis-label"
            >
              {val}
            </text>
          ))}

          {/* Bars */}
          {data.map((item, idx) => {
            const x = 70 + idx * 80;
            const revenueHeight = (item.revenue / maxValue) * 180;
            const impactHeight = (item.impact / maxValue) * 180;

            return (
              <g key={idx}>
                {/* Revenue bar */}
                <rect
                  x={x - 15}
                  y={240 - revenueHeight}
                  width="25"
                  height={revenueHeight}
                  fill="#8c5f3c"
                  rx="2"
                />
                {/* Impact bar */}
                <rect
                  x={x + 15}
                  y={240 - impactHeight}
                  width="25"
                  height={impactHeight}
                  fill="#667d3e"
                  rx="2"
                />
                {/* Month label */}
                <text x={x} y="270" className="month-label">
                  {item.month}
                </text>
              </g>
            );
          })}

          {/* Axes */}
          <line x1="60" y1="240" x2="580" y2="240" className="axis" />
          <line x1="60" y1="60" x2="60" y2="240" className="axis" />
        </svg>
      </div>
    </div>
  );
};

export const BookingsByCategory = () => {
  const data = [
    { name: 'Handcrafts', value: 46, color: '#8c5f3c' },
    { name: 'Culinary', value: 25, color: '#944c3b' },
    { name: 'Landscape', value: 20, color: '#9fb96f' },
    { name: 'Architecture', value: 9, color: '#d4a574' },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;

  const slices = data.map((item, idx) => {
    const sliceAngle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 150 + 100 * Math.cos(startRad);
    const y1 = 150 + 100 * Math.sin(startRad);
    const x2 = 150 + 100 * Math.cos(endRad);
    const y2 = 150 + 100 * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const pathData = [
      `M 150 150`,
      `L ${x1} ${y1}`,
      `A 100 100 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    return (
      <path key={idx} d={pathData} fill={item.color} className="pie-slice" />
    );
  });

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Bookings by Category</h3>
      </div>

      <div className="donut-chart-container">
        <svg viewBox="0 0 400 300" className="donut-chart">
          {slices}
          {/* Center circle */}
          <circle cx="150" cy="150" r="60" fill="white" />
          <text x="150" y="145" className="donut-center-text">
            3.8k
          </text>
          <text x="150" y="165" className="donut-center-label">
            TOTAL
          </text>
        </svg>

        <div className="chart-legend">
          {data.map((item, idx) => (
            <div key={idx} className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: item.color }}
              ></span>
              <div className="legend-info">
                <span className="legend-name">{item.name}</span>
                <span className="legend-percentage">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PendingVerifications = () => {
  const requests = [
    {
      id: 1,
      name: 'Maleik Al-Sayed',
      role: 'Master Oritsu Artisan',
      avatar: '👨',
      status: 'review',
    },
    {
      id: 2,
      name: 'Elena Rossi',
      role: 'Local Historian',
      avatar: '👩',
      status: 'review',
    },
    {
      id: 3,
      name: 'Hiroshi Tanaka',
      role: 'Kintsugi Artist - Japan',
      avatar: '👨‍🦰',
      status: 'review',
    },
  ];

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Pending Verifications</h3>
        <a href="#" className="view-all">
          View All
        </a>
      </div>

      <div className="verification-list">
        {requests.map((request) => (
          <div key={request.id} className="verification-item">
            <div className="verification-avatar">{request.avatar}</div>
            <div className="verification-info">
              <div className="verification-name">{request.name}</div>
              <div className="verification-role">{request.role}</div>
            </div>
            <button className="btn-review">Review</button>
            <button className="btn-dismiss">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RegionalGrowth = () => {
  const regions = [
    { name: 'TUSCANY, ITALY', capacity: 86, color: '#8c5f3c' },
    { name: 'KYOTO, JAPAN', capacity: 71, color: '#944c3b' },
    { name: 'MARRAKECH, MOROCCO', capacity: 81, color: '#d4a574' },
  ];

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Regional Growth</h3>
      </div>

      <div className="horizontal-bars">
        {regions.map((region, idx) => (
          <div key={idx} className="bar-item">
            <div className="bar-label">
              <span className="region-name">{region.name}</span>
              <span className="capacity-text">{region.capacity}% CAPACITY</span>
            </div>
            <div className="bar-background">
              <div
                className="bar-fill"
                style={{
                  width: `${region.capacity}%`,
                  backgroundColor: region.color,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SystemHealth = () => {
  const healthItems = [
    { label: 'PAYMENT GATEWAY', status: 'Stable', icon: '✓' },
    { label: 'CDN SERVERS', status: '99.9% Up', icon: '✓' },
    { label: 'API LATENCY', status: '125ms', icon: '⚠' },
    { label: 'DATA BACKUP', status: 'Daily Sync', icon: '✓' },
  ];

  return (
    <div className="health-grid">
      {healthItems.map((item, idx) => (
        <div key={idx} className="health-card">
          <div className="health-icon">{item.icon}</div>
          <div className="health-label">{item.label}</div>
          <div className="health-status">{item.status}</div>
        </div>
      ))}
    </div>
  );
};
