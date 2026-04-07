/**
 * Validation schemas for Booking module
 */

/**
 * Validate create booking request
 */
export const validateCreateBooking = async (req, res, next) => {
  try {
    const {
      tourId,
      experienceId,
      hotelId,
      bookingDate,
      timeSlot,
      guestsCount,
    } = req.body;

    // Validate required fields - need one of: tourId, experienceId, or hotelId
    const hasItemId = tourId || experienceId || hotelId;

    // Check required fields - timeSlot only required for experiences
    if (!hasItemId || !bookingDate || !guestsCount) {
      return res.status(400).json({
        success: false,
        message:
          'Missing required fields: (tourId OR experienceId OR hotelId), bookingDate, guestsCount',
      });
    }

    // timeSlot is only required for experiences
    if (experienceId && !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: timeSlot (required for experiences)',
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

    // Validate timeSlot - only for experiences
    if (experienceId) {
      if (typeof timeSlot !== 'string' || timeSlot.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'timeSlot must be a non-empty string (e.g., "08:00 AM")',
        });
      }
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
