

import {
  validateEmail,
  validatePhone,
  validateRequired,
  validateEnum,
  validateStringLength,
  validateNumber,
} from '../validators/common.validator.js';
import AppError from '../errors/AppError.js';


export const validateUpdateArtisanProfile = (data) => {
  const { serviceName, description, hourlyRate, experience, skills } = data;

  const updates = {};

  if (serviceName !== undefined) {
    validateStringLength('serviceName', serviceName.trim(), 1, 100);
    updates.serviceName = serviceName.trim();
  }

  if (description !== undefined) {
    validateStringLength('description', description.trim(), 10, 1000);
    updates.description = description.trim();
  }

  if (hourlyRate !== undefined) {
    validateNumber('hourlyRate', hourlyRate, 0, 1000000);
    if (hourlyRate < 0) {
      throw new AppError('Hourly rate must be greater than 0', 400);
    }
    updates.hourlyRate = hourlyRate;
  }

  if (experience !== undefined) {
    validateNumber('experience', experience, 0, 100);
    updates.experience = experience;
  }

  if (skills !== undefined) {
    if (!Array.isArray(skills)) {
      throw new AppError('Skills must be an array', 400);
    }
    if (skills.length > 20) {
      throw new AppError('Maximum 20 skills allowed', 400);
    }
    updates.skills = skills
      .map((skill) => skill.trim())
      .filter((skill) => skill);
  }

  return updates;
};


export const validateArtisanRegistration = (data) => {
  const {
    serviceName,
    description,
    hourlyRate,
    experience,
    skills,
    certificate,
  } = data;

  validateRequired(['serviceName', 'description', 'hourlyRate'], data);

  validateStringLength('serviceName', serviceName.trim(), 1, 100);
  validateStringLength('description', description.trim(), 10, 1000);
  validateNumber('hourlyRate', hourlyRate, 1, 1000000);

  if (experience !== undefined) {
    validateNumber('experience', experience, 0, 100);
  }

  if (skills !== undefined) {
    if (!Array.isArray(skills) || skills.length === 0) {
      throw new AppError('At least one skill is required', 400);
    }
    if (skills.length > 20) {
      throw new AppError('Maximum 20 skills allowed', 400);
    }
  }

  return {
    serviceName,
    description,
    hourlyRate,
    experience,
    skills,
    certificate,
  };
};


export const validateStatusUpdate = (status) => {
  const validStatuses = ['active', 'inactive', 'suspended', 'pending'];
  validateEnum('status', status.toLowerCase(), validStatuses);
  return status.toLowerCase();
};
