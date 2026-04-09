import Experience from './experience.model.js';
import { getExperienceWithStats } from './experience.service.js';
import logger from '../../common/utils/logger.js';

export const getAllExperiences = async (req, res) => {
  try {
    const { artisanId, status } = req.query;
    const filters = { publishStatus: status || 'active' };

    if (artisanId) {
      filters.artisanId = artisanId;
    }

    const experiences = await Experience.find(filters)
      .populate('artisanId', 'userId title craft')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      message: 'Danh sách trải nghiệm',
      data: experiences,
    });
  } catch (err) {
    logger.error('[getAllExperiences] Error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getExperienceDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getExperienceWithStats(id);

    res.json(result);
  } catch (err) {
    logger.error('[getExperienceDetail] Error:', err.message);
    res.status(404).json({
      success: false,
      message: err.message || 'Không tìm thấy trải nghiệm',
    });
  }
};

export const createExperience = async (req, res) => {
  try {
    const artisanId = req.params.artisanId || req.user.artisanId;

    if (!artisanId) {
      return res.status(400).json({
        success: false,
        message: 'Không có artisanId',
      });
    }

    const experience = new Experience({
      artisanId,
      ...req.body,
    });

    await experience.save();

    res.status(201).json({
      success: true,
      message: 'Tạo trải nghiệm thành công',
      data: experience,
    });
  } catch (err) {
    logger.error('[createExperience] Error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const experience = await Experience.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy trải nghiệm',
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật trải nghiệm thành công',
      data: experience,
    });
  } catch (err) {
    logger.error('[updateExperience] Error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
