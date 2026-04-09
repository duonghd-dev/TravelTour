
export const validateCreateProfile = (data) => {
  const errors = [];

  if (!data.category || !data.category.trim()) {
    errors.push('Nhóm ngành nghề là bắt buộc');
  }

  if (!data.craft || !data.craft.trim()) {
    errors.push('Nghề cụ thể là bắt buộc');
  }

  if (data.experienceYears !== undefined && data.experienceYears < 0) {
    errors.push('Số năm kinh nghiệm không thể âm');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};


export const validateUpdateProfile = (data) => {
  const errors = [];

  if (data.category !== undefined && !data.category.trim()) {
    errors.push('Nhóm ngành nghề không được để trống');
  }

  if (data.craft !== undefined && !data.craft.trim()) {
    errors.push('Nghề cụ thể không được để trống');
  }

  if (data.experienceYears !== undefined && data.experienceYears < 0) {
    errors.push('Số năm kinh nghiệm không thể âm');
  }

  if (
    data.ratingAverage !== undefined &&
    (data.ratingAverage < 0 || data.ratingAverage > 5)
  ) {
    errors.push('Rating trung bình phải từ 0 đến 5');
  }

  if (
    data.responseRate !== undefined &&
    (data.responseRate < 0 || data.responseRate > 100)
  ) {
    errors.push('Tỷ lệ phản hồi phải từ 0 đến 100');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
