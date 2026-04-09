import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBill,
  faPalette,
  faLeaf,
  faCalendarDays,
  faPlane,
} from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import adminApi from '../api/adminApi';
import './SystemOverview.scss';

const iconMap = {
  revenue: faMoneyBill,
  artisan: faPalette,
  impact: faLeaf,
  bookings: faCalendarDays,
  travelers: faPlane,
};

const SystemOverview = ({ timeRange = 'last-30-days' }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await adminApi.getDashboardMetrics(timeRange);

        console.log(
          '[SystemOverview] API Response:',
          response,
          'timeRange:',
          timeRange
        );

        if (response && response.revenue) {
          const metricsData = [
            {
              label: 'TOTAL REVENUE',
              value: response.revenue?.formatted || '$0',
              change: response.revenue?.change || '+0%',
              color: '#8c5f3c',
              icon: 'revenue',
            },
            {
              label: 'ACTIVE ARTISANS',
              value: response.artisans?.formatted || '0',
              change: response.artisans?.change || '+0%',
              color: '#944c3b',
              icon: 'artisan',
            },
            {
              label: 'HERITAGE IMPACT FUND',
              value: response.impact?.formatted || '$0',
              change: response.impact?.change || '+0%',
              color: '#9fb96f',
              icon: 'impact',
              highlight: true,
            },
            {
              label: 'TOTAL BOOKINGS',
              value: response.bookings?.formatted || '0',
              change: response.bookings?.change || '+0%',
              color: '#d4a574',
              icon: 'bookings',
            },
            {
              label: 'ACTIVE TRAVELERS',
              value: response.travelers?.formatted || '0',
              change: response.travelers?.change || '+0%',
              color: '#8c5f3c',
              icon: 'travelers',
            },
          ];
          setMetrics(metricsData);
        } else {
          console.error(
            '[SystemOverview] Invalid response structure:',
            response
          );
          setError(
            `Dữ liệu không hợp lệ từ server. Response: ${JSON.stringify(response)}`
          );
        }
      } catch (err) {
        console.error('Error loading dashboard metrics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="system-overview">
        <div className="loading">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="system-overview">
        <div className="error">Lỗi tải dữ liệu: {error}</div>
      </div>
    );
  }

  return (
    <div className="system-overview">
      <div className="metrics-grid">
        {metrics?.map((metric, index) => (
          <div
            key={index}
            className={`metric-card ${metric.highlight ? 'highlight' : ''}`}
            style={{ borderTopColor: metric.color }}
          >
            <div className="metric-icon">
              {iconMap[metric.icon] ? (
                <FontAwesomeIcon icon={iconMap[metric.icon]} />
              ) : (
                metric.icon
              )}
            </div>
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
