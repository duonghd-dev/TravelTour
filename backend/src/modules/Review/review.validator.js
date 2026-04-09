


export const validateCreateReview = async (req, res, next) => {
  try {
    const { experienceId, rating, content } = req.body;

    
    if (!experienceId || !rating || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: experienceId, rating, content',
      });
    }

    
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5',
      });
    }

    
    if (typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Content must be a non-empty string',
      });
    }

    if (content.length < 10 || content.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Content must be between 10 and 1000 characters',
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


export const validateUpdateReview = async (req, res, next) => {
  try {
    const { rating, content } = req.body;

    
    if (!rating && !content) {
      return res.status(400).json({
        success: false,
        message: 'At least one field to update is required: rating or content',
      });
    }

    
    if (rating !== undefined) {
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be an integer between 1 and 5',
        });
      }
    }

    
    if (content !== undefined) {
      if (typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Content must be a non-empty string',
        });
      }

      if (content.length < 10 || content.length > 1000) {
        return res.status(400).json({
          success: false,
          message: 'Content must be between 10 and 1000 characters',
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
