import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { useToast } from '@/contexts';
import { fetchUsers, deleteUser } from '../api';
import maleAvatarImg from '@/assets/images/avatarDefault/maleAvatar.png';
import femaleAvatarImg from '@/assets/images/avatarDefault/femaleAvatar.png';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import './UserTable.scss';

const UserTable = forwardRef(({ filters = {}, onEditUser = () => {} }, ref) => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.role, filters.status]);

  useEffect(() => {
    loadUsers();
  }, [currentPage, filters.search, filters.role, filters.status]);

  // Expose loadUsers method via ref
  useImperativeHandle(ref, () => ({
    loadUsers,
  }));

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Build filter object - only include filters that are not 'all'
      const filterParams = {
        page: currentPage,
        limit: 7,
      };

      if (filters.search && filters.search.trim()) {
        filterParams.search = filters.search.trim();
      }
      if (filters.role && filters.role !== 'all') {
        filterParams.role = filters.role;
      }
      if (filters.status && filters.status !== 'all') {
        filterParams.status = filters.status;
      }

      const response = await fetchUsers(filterParams);
      setUsers(response.data || []);
      setTotalPages(response.pagination?.pages || 1);
      setTotalResults(response.pagination?.total || 0);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
      setTotalPages(1);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    const user = users.find((u) => u._id === userId);
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete?._id) return;

    setIsDeleting(true);
    try {
      await deleteUser(userToDelete._id);
      toast.success(
        ` Xóa ${userToDelete.firstName} ${userToDelete.lastName} thành công!`,
        3000
      );
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      await loadUsers();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Không thể xóa người dùng';
      toast.error(`❌ ${errorMessage}`, 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteUser = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: '#d32f2f',
      staff: '#f4a460',
      artisan: '#8b6f47',
      customer: '#a67566',
    };
    return colors[role] || '#999';
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Admin',
      staff: 'Staff',
      artisan: 'Artisan',
      customer: 'Tourist',
    };
    return labels[role] || role;
  };

  const getAvatarUrl = (avatar, gender) => {
    // If avatar is a data URL (base64), use it directly
    if (avatar && avatar.startsWith('data:')) {
      return avatar;
    }
    // If avatar is a path string (e.g., 'assets/images/avatarDefault/maleAvatar.png')
    if (avatar && typeof avatar === 'string') {
      return `/${avatar}`;
    }
    // If avatar is null or empty, use default by gender
    if (gender === 'male') return maleAvatarImg;
    if (gender === 'female') return femaleAvatarImg;
    return maleAvatarImg; // Default to male avatar
  };

  return (
    <div className="user-table-container">
      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Verification</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan="6" className="empty-message">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="user-row">
                      <td className="user-cell">
                        <div className="user-info">
                          <div className="user-avatar">
                            <img
                              src={getAvatarUrl(user.avatar, user.gender)}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="avatar-img"
                            />
                          </div>
                          <div className="user-details">
                            <div className="user-name">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="user-email">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className="role-badge"
                          style={{
                            backgroundColor: getRoleColor(user.role) + '20',
                            color: getRoleColor(user.role),
                          }}
                        >
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td>
                        <div className="status-cell">
                          <span
                            className={`status-dot ${user.isActive ? 'active' : 'inactive'}`}
                          ></span>
                          <span>{user.isActive ? 'Active' : 'Suspended'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="verification-cell">
                          {user.isEmailVerified ? (
                            <span className="verified-badge">
                              <span className="verified-icon">✓</span> Verified
                            </span>
                          ) : (
                            <span className="unverified-badge">Pending</span>
                          )}
                        </div>
                      </td>
                      <td className="date-cell">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn edit-btn"
                            title="Edit"
                            onClick={() => onEditUser(user)}
                          >
                            ✎
                          </button>
                          <button
                            className="action-btn delete-btn"
                            title="Delete"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <span className="pagination-info">
              Showing {users.length === 0 ? 0 : (currentPage - 1) * 10 + 1}-
              {Math.min(currentPage * 10, totalResults)} of {totalResults}{' '}
              results
            </span>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Previous
              </button>

              {/* Generate page buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Show first 3 pages, current page, and last page
                  if (
                    page <= 3 ||
                    page === currentPage ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        className={`pagination-btn ${
                          page === currentPage ? 'active' : ''
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === 4 ||
                    (page === currentPage - 2 && page > 3)
                  ) {
                    return (
                      <span key={page} className="pagination-dots">
                        ...
                      </span>
                    );
                  }
                  return null;
                }
              )}

              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        userName={
          userToDelete
            ? `${userToDelete.firstName} ${userToDelete.lastName}`
            : ''
        }
        onConfirm={confirmDeleteUser}
        onCancel={cancelDeleteUser}
        isLoading={isDeleting}
      />
    </div>
  );
});

UserTable.displayName = 'UserTable';

export default UserTable;
