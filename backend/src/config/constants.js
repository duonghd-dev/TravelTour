


export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Email không hợp lệ',
  INVALID_PASSWORD: 'Mật khẩu phải có ít nhất 6 ký tự',
  EMAIL_EXISTS: 'Email đã được sử dụng',
  USER_NOT_FOUND: 'Người dùng không tồn tại',
  INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng',
  UNAUTHORIZED: 'Bạn không có quyền thực hiện hành động này',
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  SERVER_ERROR: 'Lỗi máy chủ',
};


export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  REGISTER_SUCCESS: 'Đăng ký thành công',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  UPDATE_SUCCESS: 'Cập nhật thành công',
  DELETE_SUCCESS: 'Xóa thành công',
  CREATE_SUCCESS: 'Tạo mới thành công',
};


export const USER_ROLES = {
  ADMIN: 'admin',
  ARTISAN: 'artisan',
  CUSTOMER: 'customer',
};


export const EXPERIENCE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};


export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};


export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  BANK_TRANSFER: 'bank_transfer',
  CASH: 'cash',
};


export const DURATION_UNITS = {
  HOUR: 'hour',
  DAY: 'day',
  SESSION: 'session',
};


export const AVAILABLE_DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];


export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_TIME: 10 * 60 * 1000, 
  COOLDOWN_TIME: 30 * 1000, 
  RATE_LIMIT_WINDOW: 60 * 60 * 1000, 
  MAX_ATTEMPTS: 5, 
};
