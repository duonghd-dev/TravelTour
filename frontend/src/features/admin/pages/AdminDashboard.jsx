import React, { useState } from 'react';
import SystemOverview from '../components/SystemOverview';
import {
  RevenueVsImpact,
  BookingsByCategory,
  PendingVerifications,
  RegionalGrowth,
  SystemHealth,
} from '../components/ChartComponents';
import './AdminDashboard.scss';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('last-30-days');

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>System Overview</h1>
          <p>Welcome back! Here's your platform's performance overview.</p>
          <p>Real-time performance and cultural impact metrics</p>
        </div>
        <div className="time-range-selector">
          <button
            className={timeRange === 'last-30-days' ? 'active' : ''}
            onClick={() => setTimeRange('last-30-days')}
          >
            Last 30 Days
          </button>
          <button
            className={timeRange === 'quarterly' ? 'active' : ''}
            onClick={() => setTimeRange('quarterly')}
          >
            Quarterly
          </button>
          <button
            className={timeRange === 'yearly' ? 'active' : ''}
            onClick={() => setTimeRange('yearly')}
          >
            Yearly
          </button>
          <button className="custom-range">Custom Range</button>
        </div>
      </div>

      {}
      <SystemOverview timeRange={timeRange} />

      {}
      <div className="dashboard-grid-2">
        <div className="grid-col">
          <RevenueVsImpact />
        </div>
        <div className="grid-col">
          <BookingsByCategory />
        </div>
      </div>

      {}
      <div className="dashboard-grid-2">
        <div className="grid-col full-width">
          <PendingVerifications />
        </div>
      </div>

      {}
      <div className="dashboard-grid-2">
        <div className="grid-col full-width">
          <RegionalGrowth />
        </div>
      </div>

      {}
      <div className="chart-card">
        <div className="chart-header">
          <h3>System Health</h3>
        </div>
        <SystemHealth />
      </div>
    </div>
  );
};

export default AdminDashboard;
