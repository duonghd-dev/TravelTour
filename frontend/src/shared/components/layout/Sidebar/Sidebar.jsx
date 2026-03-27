import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.scss';
import logoIcon from '@assets/images/Logo.png';
import {
  usersIcon,
  bookingIcon,
  contentIcon,
  experiencesIcon,
  settingIcon,
  supportIcon,
  meshIcon,
} from '@assets/icons/svgs';

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
    { icon: usersIcon, label: 'Users', path: '/admin/users' },
    { icon: experiencesIcon, label: 'Artisans', path: '/admin/artisans' },
    { icon: experiencesIcon, label: 'Experiences', path: '/admin/experiences' },
    { icon: bookingIcon, label: 'Bookings', path: '/admin/bookings' },
    { icon: contentIcon, label: 'Content', path: '/admin/content' },
  ];

  const bottomMenuItems = [
    { icon: settingIcon, label: 'Settings', path: '/admin/settings' },
    { icon: supportIcon, label: 'Support', path: '/admin/support' },
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
              <img src={item.icon} alt={item.label} className="menu-svg-icon" />
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
            <img src={meshIcon} alt="System Status" className="menu-svg-icon" />
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
              <img src={item.icon} alt={item.label} className="menu-svg-icon" />
              {!isCollapsed && <span className="menu-label">{item.label}</span>}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
