/**
 * Validation schemas for Experience module
 */

/**
 * Validate create experience request
 */
export const validateCreateExperience = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      duration,
      maxGuests,
      minGuests,
      location,
    } = req.body;

    // Validate required fields
    if (!title || !description || !price || !duration || !location) {
      return res.status(400).json({
        success: false,
        message:
          'Missing required fields: title, description, price, duration, location',
      });
    }

    // Validate price
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number',
      });
    }

    // Validate duration
    if (
      !duration.value ||
      !duration.unit ||
      !['hour', 'day', 'session'].includes(duration.unit)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Duration must have value and unit (hour/day/session)',
      });
    }

    // Validate guests
    if (minGuests && maxGuests && minGuests > maxGuests) {
      return res.status(400).json({
        success: false,
        message: 'minGuests cannot be greater than maxGuests',
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
 * Validate update experience request
 */
export const validateUpdateExperience = async (req, res, next) => {
  const { title, price, duration, maxGuests, minGuests } = req.body;

  try {
    if (price !== undefined) {
      if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a positive number',
        });
      }
    }

    if (duration !== undefined) {
      if (
        !duration.value ||
        !duration.unit ||
        !['hour', 'day', 'session'].includes(duration.unit)
      ) {
        return res.status(400).json({
          success: false,
          message: 'Duration must have value and unit (hour/day/session)',
        });
      }
    }

    if (maxGuests && minGuests && minGuests > maxGuests) {
      return res.status(400).json({
        success: false,
        message: 'minGuests cannot be greater than maxGuests',
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
