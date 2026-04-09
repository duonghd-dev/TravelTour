import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faExclamationTriangle,
  faTimes,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import adminApi from '../api/adminApi';
import './ChartComponents.scss';

export const RevenueVsImpact = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminApi.getRevenueByMonth();
        console.log('Revenue by month data:', response);
        setData(Array.isArray(response) ? response : response?.data || []);
      } catch (error) {
        console.error('Error fetching revenue by month:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="chart-card">Loading...</div>;

  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.revenue || 0, d.impact || 0)),
    100
  );

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

          {/* Bar rendering */}
          {data.map((item, idx) => {
            const x = 70 + idx * 80;
            const revenueHeight =
              maxValue > 0 ? (item.revenue / maxValue) * 180 : 0;
            const impactHeight =
              maxValue > 0 ? (item.impact / maxValue) * 180 : 0;

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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminApi.getBookingsByCategory();
        console.log('Bookings by category data:', response);
        setData(Array.isArray(response) ? response : response?.data || []);
      } catch (error) {
        console.error('Error fetching bookings by category:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="chart-card">Loading...</div>;

  let currentAngle = -90;

  const slices = data.map((item, idx) => {
    const sliceAngle = (item.value / 100) * 360;
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

  const totalBookings = data.reduce((sum, item) => sum + (item.count || 0), 0);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Bookings by Category</h3>
      </div>

      <div className="donut-chart-container">
        <svg viewBox="0 0 400 300" className="donut-chart">
          {slices}
          {/* Center donut hole */}
          <circle cx="150" cy="150" r="60" fill="white" />
          <text x="150" y="145" className="donut-center-text">
            {totalBookings}
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
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminApi.getPendingVerifications();
        console.log('Pending verifications data:', response);
        setRequests(Array.isArray(response) ? response : response?.data || []);
      } catch (error) {
        console.error('Error fetching pending verifications:', error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="chart-card">Loading...</div>;

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Pending Verifications</h3>
        <a href="#" className="view-all">
          View All
        </a>
      </div>

      <div className="verification-list">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request.id || request._id} className="verification-item">
              <div className="verification-avatar">{request.avatar}</div>
              <div className="verification-info">
                <div className="verification-name">{request.name}</div>
                <div className="verification-role">{request.role}</div>
              </div>
              <button className="btn-review">Review</button>
              <button className="btn-dismiss">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          ))
        ) : (
          <p className="no-data">No pending verifications</p>
        )}
      </div>
    </div>
  );
};

export const RegionalGrowth = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminApi.getArtisansByRegion();
        console.log('Regional growth data:', response);
        setRegions(Array.isArray(response) ? response : response?.data || []);
      } catch (error) {
        console.error('Error fetching regional growth:', error);
        setRegions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="chart-card">Loading...</div>;

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
              <span className="capacity-text">
                {region.capacity} Artisans (+{region.growth}%)
              </span>
            </div>
            <div className="bar-background">
              <div
                className="bar-fill"
                style={{
                  width: `${Math.min((region.capacity / 100) * 100, 100)}%`,
                  backgroundColor: '#8c5f3c',
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
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminApi.getDashboardMetrics();
        console.log('System metrics data:', response);

        const healthItems = [
          {
            label: 'PLATFORM REVENUE',
            status: response?.revenue?.formatted || '$0',
            icon: 'check',
          },
          {
            label: 'ACTIVE ARTISANS',
            status: response?.artisans?.formatted || '0',
            icon: 'check',
          },
          {
            label: 'TOTAL BOOKINGS',
            status: response?.bookings?.formatted || '0',
            icon: 'check',
          },
          {
            label: 'ACTIVE TRAVELERS',
            status: response?.travelers?.formatted || '0',
            icon: 'check',
          },
        ];

        setMetrics(healthItems);
      } catch (error) {
        console.error('Error fetching system metrics:', error);
        const defaultItems = [
          { label: 'PLATFORM REVENUE', status: '$0', icon: 'check' },
          { label: 'ACTIVE ARTISANS', status: '0', icon: 'check' },
          { label: 'TOTAL BOOKINGS', status: '0', icon: 'check' },
          { label: 'ACTIVE TRAVELERS', status: '0', icon: 'check' },
        ];
        setMetrics(defaultItems);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'check':
        return faCheck;
      case 'warning':
        return faExclamationTriangle;
      default:
        return faCheck;
    }
  };

  if (loading) return <div className="health-grid">Loading...</div>;

  return (
    <div className="health-grid">
      {metrics.map((item, idx) => (
        <div key={idx} className="health-card">
          <div className="health-icon">
            <FontAwesomeIcon icon={getIcon(item.icon)} />
          </div>
          <div className="health-label">{item.label}</div>
          <div className="health-status">{item.status}</div>
        </div>
      ))}
    </div>
  );
};
