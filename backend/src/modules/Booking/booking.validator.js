/**
 * Validation schemas for Booking module
 */

/**
 * Validate create booking request
 */
export const validateCreateBooking = async (req, res, next) => {
  try {
    const { experienceId, bookingDate, timeSlot, guestsCount } = req.body;

    // Validate required fields
    if (!experienceId || !bookingDate || !timeSlot || !guestsCount) {
      return res.status(400).json({
        success: false,
        message:
          'Missing required fields: experienceId, bookingDate, timeSlot, guestsCount',
      });
    }

    // Validate date
    const date = new Date(bookingDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking date format',
      });
    }

    // Validate guests count
    if (!Number.isInteger(guestsCount) || guestsCount < 1) {
      return res.status(400).json({
        success: false,
        message: 'guestsCount must be a positive integer',
      });
    }

    // Validate timeSlot
    if (typeof timeSlot !== 'string' || timeSlot.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'timeSlot must be a non-empty string (e.g., "08:00 AM")',
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Validation error',
      error: error.message,
    });
  }
};

/**
 * Validate update booking status
 */
export const validateUpdateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Validation error',
      error: error.message,
    });
  }
};
