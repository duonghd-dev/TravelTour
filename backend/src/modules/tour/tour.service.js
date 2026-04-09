import Tour from './tour.model.js';
import AppError from '../../common/errors/AppError.js';

export const tourService = {
  getAllTours: async (filters = {}) => {
    const {
      search,
      region,
      location,
      minPrice,
      maxPrice,
      duration,
      page = 1,
      limit = 10,
    } = filters;

    const query = { publishStatus: 'active' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (region) {
      query.region = region;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    if (duration) {
      query['duration.value'] = duration;
    }

    const skip = (page - 1) * limit;
    const tours = await Tour.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ rating: -1 });

    const total = await Tour.countDocuments(query);

    return {
      data: tours,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  getTourById: async (id) => {
    const tour = await Tour.findById(id);
    if (!tour || tour.publishStatus !== 'active') {
      throw new AppError('Tour not found', 404);
    }
    return tour;
  },

  createTour: async (data) => {
    const tour = new Tour(data);
    await tour.save();
    return tour;
  },

  updateTour: async (id, data) => {
    const tour = await Tour.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return tour;
  },

  deleteTour: async (id) => {
    const tour = await Tour.findByIdAndUpdate(
      id,
      { publishStatus: 'inactive' },
      { new: true }
    );
    return tour;
  },

  searchTours: async (query) => {
    const tours = await Tour.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
      ],
      status: 'active',
    }).limit(20);
    return tours;
  },

  getByRegion: async (region) => {
    const tours = await Tour.find({
      region,
      status: 'active',
    });
    return tours;
  },

  getByDuration: async (days) => {
    const tours = await Tour.find({
      'duration.value': days,
      status: 'active',
    });
    return tours;
  },
};
