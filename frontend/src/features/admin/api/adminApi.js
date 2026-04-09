import apiService from '@/services/api/apiService';

const ADMIN_API = '/api/v1/admin';

/**
 * Dashboard Metrics API
 */
export const adminApi = {
  /**
   * Lấy tất cả dashboard metrics
   */
  getDashboardMetrics: async (timeRange = 'last-30-days') => {
    try {
      const response = await apiService.get(
        `${ADMIN_API}/metrics?timeRange=${timeRange}&t=${Date.now()}`,
        {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        }
      );
      // apiService.get() đã return response.data, không cần .data lại
      return response;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  },

  /**
   * Lấy metrics doanh thu
   */
  getRevenueMetrics: async () => {
    try {
      const response = await apiService.get(`${ADMIN_API}/revenue`);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue metrics:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách artisan chờ xác thực
   */
  getPendingVerifications: async () => {
    try {
      const response = await apiService.get(
        `${ADMIN_API}/pending-verifications`
      );
      return response;
    } catch (error) {
      console.error('Error fetching pending verifications:', error);
      throw error;
    }
  },

  /**
   * Lấy booking theo category
   */
  getBookingsByCategory: async () => {
    try {
      const response = await apiService.get(
        `${ADMIN_API}/bookings-by-category`
      );
      return response;
    } catch (error) {
      console.error('Error fetching bookings by category:', error);
      throw error;
    }
  },

  /**
   * Lấy doanh thu theo tháng
   */
  getRevenueByMonth: async () => {
    try {
      const response = await apiService.get(`${ADMIN_API}/revenue-by-month`);
      return response;
    } catch (error) {
      console.error('Error fetching revenue by month:', error);
      throw error;
    }
  },

  /**
   * Lấy artisan theo vùng địa lý
   */
  getArtisansByRegion: async () => {
    try {
      const response = await apiService.get(`${ADMIN_API}/artisans-by-region`);
      return response;
    } catch (error) {
      console.error('Error fetching artisans by region:', error);
      throw error;
    }
  },
};

export default adminApi;
