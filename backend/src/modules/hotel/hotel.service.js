import Hotel from './hotel.model.js';
import AppError from '../../common/errors/AppError.js';

export const hotelService = {
  getAllHotels: async (filters = {}) => {
    const {
      search,
      category,
      location,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = filters;

    const query = { publishStatus: 'active' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    const skip = (page - 1) * limit;
    const hotels = await Hotel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ rating: -1 });

    const total = await Hotel.countDocuments(query);

    return {
      data: hotels,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  getHotelById: async (id) => {
    const hotel = await Hotel.findById(id);
    if (!hotel || hotel.publishStatus !== 'active') {
      throw new AppError('Hotel not found', 404);
    }
    return hotel;
  },

  createHotel: async (data) => {
    const hotel = new Hotel(data);
    await hotel.save();
    return hotel;
  },

  updateHotel: async (id, data) => {
    const hotel = await Hotel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return hotel;
  },

  deleteHotel: async (id) => {
    const hotel = await Hotel.findByIdAndUpdate(
      id,
      { publishStatus: 'inactive' },
      { new: true }
    );
    return hotel;
  },

  searchHotels: async (query) => {
    const hotels = await Hotel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
      ],
      status: 'active',
    }).limit(20);
    return hotels;
  },

  getByCategory: async (category) => {
    const hotels = await Hotel.find({
      category,
      status: 'active',
    });
    return hotels;
  },
};
