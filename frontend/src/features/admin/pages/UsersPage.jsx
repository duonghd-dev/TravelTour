import React, { useState, useRef } from 'react';
import { useToast } from '@/contexts';
import UserStats from '../components/UserStats';
import UserTable from '../components/UserTable';
import UserCreateModal from '../components/UserCreateModal';
import UserEditModal from '../components/UserEditModal';
import { exportUsersReport } from '../api';
import './UsersPage.scss';

const UsersPage = () => {
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
    dateRange: null,
  });

  const userTableRef = useRef();

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleRoleChange = (e) => {
    setFilters((prev) => ({ ...prev, role: e.target.value }));
  };

  const handleStatusChange = (e) => {
    setFilters((prev) => ({ ...prev, status: e.target.value }));
  };

  const handleExportReport = async () => {
    try {
      await exportUsersReport(filters);
      toast.success('Export Excel thành công!', 3000);
    } catch (error) {
      const errorMsg = error?.message || 'Không thể export dữ liệu';
      toast.error(errorMsg, 3000);
    }
  };

  const handleCreateUser = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSuccess = () => {
    // Refresh users list
    if (userTableRef.current) {
      userTableRef.current.loadUsers();
    }
  };

  const handleEditUser = (user) => {
    setSelectedUserId(user._id);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedUserId(null);
  };

  return (
    <div className="users-page">
      {/* Header Section */}
      <div className="users-header">
        <div className="header-content">
          <h1>User Management</h1>
          <p>Monitor and curate the global community of heritage guardians.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleExportReport}>
            <span className="btn-icon">📊</span>
            Export Report
          </button>
          <button className="btn btn-primary" onClick={handleCreateUser}>
            <span className="btn-icon">+</span>
            Create User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <UserStats />

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-filter">
          <input
            type="text"
            className="search-input"
            placeholder="Search users by name, email or ID..."
            value={filters.search}
            onChange={handleSearchChange}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-controls">
          <select
            className="filter-select"
            value={filters.role}
            onChange={handleRoleChange}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="artisan">Artisan</option>
            <option value="customer">Tourist</option>
          </select>

          <select
            className="filter-select"
            value={filters.status}
            onChange={handleStatusChange}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Suspended</option>
          </select>

          <button className="filter-btn date-range">📅 Date Range</button>
        </div>
      </div>

      {/* User Table */}
      <UserTable
        ref={userTableRef}
        filters={filters}
        onEditUser={handleEditUser}
      />

      {/* Create User Modal */}
      <UserCreateModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      {/* Edit User Modal */}
      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSuccess={handleModalSuccess}
        userId={selectedUserId}
      />
    </div>
  );
};

export default UsersPage;
