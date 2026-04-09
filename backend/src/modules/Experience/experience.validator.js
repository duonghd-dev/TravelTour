// Hàm kiểm tra định dạng thời gian HH:MM
const isValidTimeFormat = (time) => {
  if (typeof time !== 'string') return false;
  const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time.trim());
};

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
      timeSlots,
    } = req.body;

    if (!title || !description || !price || !duration || !location) {
      return res.status(400).json({
        success: false,
        message:
          'Missing required fields: title, description, price, duration, location',
      });
    }

    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number',
      });
    }

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

    if (minGuests && maxGuests && minGuests > maxGuests) {
      return res.status(400).json({
        success: false,
        message: 'minGuests cannot be greater than maxGuests',
      });
    }

    // Kiểm tra timeSlots nếu được cung cấp
    if (timeSlots) {
      if (!Array.isArray(timeSlots)) {
        return res.status(400).json({
          success: false,
          message: 'timeSlots phải là một mảng',
        });
      }

      for (let i = 0; i < timeSlots.length; i++) {
        const slot = timeSlots[i];

        if (!slot.time) {
          return res.status(400).json({
            success: false,
            message: `Time slot ${i + 1}: time là bắt buộc`,
          });
        }

        if (!isValidTimeFormat(slot.time)) {
          return res.status(400).json({
            success: false,
            message: `Time slot ${i + 1}: định dạng thời gian không hợp lệ. Vui lòng sử dụng HH:MM (ví dụ: 09:00)`,
          });
        }

        if (
          slot.capacity &&
          (typeof slot.capacity !== 'number' || slot.capacity <= 0)
        ) {
          return res.status(400).json({
            success: false,
            message: `Time slot ${i + 1}: capacity phải là số dương`,
          });
        }
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

export const validateUpdateExperience = async (req, res, next) => {
  const { title, price, duration, maxGuests, minGuests, timeSlots } = req.body;

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

    // Kiểm tra timeSlots nếu được cung cấp
    if (timeSlots) {
      if (!Array.isArray(timeSlots)) {
        return res.status(400).json({
          success: false,
          message: 'timeSlots phải là một mảng',
        });
      }

      for (let i = 0; i < timeSlots.length; i++) {
        const slot = timeSlots[i];

        if (!slot.time) {
          return res.status(400).json({
            success: false,
            message: `Time slot ${i + 1}: time là bắt buộc`,
          });
        }

        if (!isValidTimeFormat(slot.time)) {
          return res.status(400).json({
            success: false,
            message: `Time slot ${i + 1}: định dạng thời gian không hợp lệ. Vui lòng sử dụng HH:MM (ví dụ: 09:00)`,
          });
        }

        if (
          slot.capacity &&
          (typeof slot.capacity !== 'number' || slot.capacity <= 0)
        ) {
          return res.status(400).json({
            success: false,
            message: `Time slot ${i + 1}: capacity phải là số dương`,
          });
        }
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
