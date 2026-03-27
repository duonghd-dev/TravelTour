import React, { useEffect, useState } from 'react';
import { fetchUserStats } from '../api';
import './UserStats.scss';

const UserStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTourists: 0,
    verifiedArtisans: 0,
    pendingApprovals: 0,
    growth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchUserStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      id: 'total-users',
      label: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: `+${stats.growth}%`,
      icon: '👥',
      color: '#a67566',
    },
    {
      id: 'active-tourists',
      label: 'Active Tourists',
      value: stats.activeTourists.toLocaleString(),
      icon: '🎭',
      color: '#d32f2f',
    },
    {
      id: 'verified-artisans',
      label: 'Verified Artisans',
      value: stats.verifiedArtisans.toLocaleString(),
      icon: '🎨',
      color: '#8b6f47',
    },
    {
      id: 'pending-approvals',
      label: 'Pending Approvals',
      value: stats.pendingApprovals.toLocaleString(),
      icon: '📋',
      color: '#f4a460',
    },
  ];

  return (
    <div className="user-stats">
      {statCards.map((card) => (
        <div key={card.id} className="stat-card">
          <div className="stat-header">
            <span className="stat-icon" style={{ color: card.color }}>
              {card.icon}
            </span>
            {card.change && (
              <span className="stat-change">
                <span className="change-icon">📈</span>
                {card.change}
              </span>
            )}
          </div>
          <div className="stat-content">
            <p className="stat-label">{card.label}</p>
            <p className="stat-value">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStats;
