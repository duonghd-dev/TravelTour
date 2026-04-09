import axiosInstance from '../../../services/axiosInstance';
import * as XLSX from 'xlsx';

const usersAPI = '/api/v1/users';


export const fetchUsers = async (params = {}) => {
  try {
    const response = await axiosInstance.get(usersAPI, {
      params: {
        limit: params.limit || 10,
        page: params.page || 1,
        ...(params.role && { role: params.role }),
        ...(params.status && { status: params.status }),
        ...(params.search && { search: params.search }),
        ...(params.sort && { sort: params.sort }),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};


export const fetchUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`${usersAPI}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
};


export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post(usersAPI, userData);
    return response.data;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};


export const updateUser = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(`${usersAPI}/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
};


export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`${usersAPI}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
};


export const fetchUserStats = async () => {
  try {
    const response = await axiosInstance.get(`${usersAPI}/stats/overview`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    
    return {
      totalUsers: 0,
      activeTourists: 0,
      verifiedArtisans: 0,
      pendingApprovals: 0,
      growth: 0,
    };
  }
};


export const exportUsersReport = async (filters = {}) => {
  try {
    
    const allUsers = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const response = await axiosInstance.get(usersAPI, {
        params: {
          page,
          limit: 100,
          ...(filters.search && { search: filters.search }),
          ...(filters.role && filters.role !== 'all' && { role: filters.role }),
          ...(filters.status &&
            filters.status !== 'all' && { status: filters.status }),
        },
      });

      allUsers.push(...(response.data.data || []));
      totalPages = response.data.pagination?.pages || 1;
      page++;
    }

    
    const formattedUsers = allUsers.map((user) => ({
      'First Name': user.firstName || '',
      'Last Name': user.lastName || '',
      Email: user.email || '',
      Phone: user.phone || '',
      Role: user.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : '',
      Status: user.isActive ? 'Active' : 'Suspended',
      'Email Verified': user.isEmailVerified ? 'Yes' : 'No',
      'Joined Date': user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('vi-VN')
        : '',
      '2FA': user.twoFactorEnabled ? 'Enabled' : 'Disabled',
    }));

    
    const ws = XLSX.utils.json_to_sheet(formattedUsers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');

    
    const colWidths = [
      { wch: 15 }, 
      { wch: 15 }, 
      { wch: 25 }, 
      { wch: 15 }, 
      { wch: 12 }, 
      { wch: 12 }, 
      { wch: 14 }, 
      { wch: 13 }, 
      { wch: 12 }, 
    ];
    ws['!cols'] = colWidths;

    
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + '1';
      if (!ws[address]) continue;
      ws[address].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '4472C4' } },
        alignment: { horizontal: 'center', vertical: 'center' },
      };
    }

    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `users-report-${timestamp}.xlsx`;

    
    XLSX.writeFile(wb, filename);
  } catch (error) {
    console.error('Failed to export users:', error);
    throw error;
  }
};
