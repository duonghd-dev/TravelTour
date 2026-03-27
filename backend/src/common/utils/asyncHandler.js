/**
 * Async Handler Wrapper
 * Tự động catch lỗi từ async/await controllers
 * Không cần try-catch ở mỗi controller
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
