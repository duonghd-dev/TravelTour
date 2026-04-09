import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar,
  faUsers,
  faHandSparkles,
  faLightbulb,
  faCalendarDays,
  faFileLines,
  faCog,
  faHeadset,
  faServer,
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.scss';
import logoIcon from '@assets/images/Logo.png';

const Sidebar = ({ onCollapseChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onCollapseChange) {
      onCollapseChange(newState);
    }
  };

  const menuItems = [
    {
      icon: faChartBar,
      label: 'Dashboard',
      path: '/admin',
    },
    { icon: faUsers, label: 'Users', path: '/admin/users' },
    { icon: faHandSparkles, label: 'Artisans', path: '/admin/artisans' },
    { icon: faLightbulb, label: 'Experiences', path: '/admin/experiences' },
    { icon: faCalendarDays, label: 'Bookings', path: '/admin/bookings' },
    { icon: faFileLines, label: 'Content', path: '/admin/content' },
  ];

  const bottomMenuItems = [
    { icon: faCog, label: 'Settings', path: '/admin/settings' },
    { icon: faHeadset, label: 'Support', path: '/admin/support' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <button
          className="brand-logo-btn"
          onClick={handleToggleCollapse}
          title="Toggle sidebar"
        >
          <img src={logoIcon} alt="Van Hoa Trinh Logo" />
        </button>
        {!isCollapsed && <h2>Van Hoa Trinh</h2>}
      </div>

      <nav className="sidebar-menu">
        <div className="menu-section">
          <p className="section-title">Main</p>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={item.icon} className="menu-icon" />
              {!isCollapsed && <span className="menu-label">{item.label}</span>}
            </Link>
          ))}
        </div>

        <div className="menu-section">
          <p className="section-title">System</p>
          <Link
            to="/admin/system-status"
            className={`menu-item ${isActive('/admin/system-status') ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faServer} className="menu-icon" />
            {!isCollapsed && <span className="menu-label">System Status</span>}
          </Link>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="menu-section">
          {bottomMenuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={item.icon} className="menu-icon" />
              {!isCollapsed && <span className="menu-label">{item.label}</span>}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
