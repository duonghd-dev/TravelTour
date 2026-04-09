import User from './user.model.js';
import Artisan from '../artisan/artisan.model.js';
import Experience from '../experience/experience.model.js';
import Hotel from '../hotel/hotel.model.js';
import Tour from '../tour/tour.model.js';
import { hashPassword, comparePassword } from '../../common/utils/hash.js';
import logger from '../../common/utils/logger.js';
import { sendOTPEmail, sendVerifyEmailLink } from '../../common/utils/email.js';
import { generateOTP, getOTPExpiration } from '../../common/utils/otp.js';

export const getProfile = async (userId) => {
  const user = await User.findById(userId).select(
    'firstName lastName email phone avatar gender role isActive lastLoginAt twoFactorEnabled createdAt'
  );

  if (!user) {
    throw new Error('User not found');
  }

  return {
    success: true,
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phone,
      avatar: user.avatar,
      gender: user.gender,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLoginAt,
      twoFactorEnabled: user.twoFactorEnabled || false,
      createdAt: user.createdAt,
    },
  };
};

export const updateProfile = async (userId, updateData) => {
  const { firstName, lastName, email, phoneNumber, avatar, gender } =
    updateData;

  if (email) {
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      throw new Error('Email already in use');
    }
  }

  if (phoneNumber) {
    const existingUser = await User.findOne({
      phone: phoneNumber,
      _id: { $ne: userId },
    });
    if (existingUser) {
      throw new Error('Phone number already in use');
    }
  }

  const updateObj = {};
  if (firstName) updateObj.firstName = firstName;
  if (lastName) updateObj.lastName = lastName;
  if (email) updateObj.email = email;
  if (phoneNumber) updateObj.phone = phoneNumber;
  if (avatar !== undefined) updateObj.avatar = avatar;
  if (gender !== undefined) updateObj.gender = gender;

  const user = await User.findByIdAndUpdate(userId, updateObj, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new Error('User not found');
  }

  logger.info(`User ${userId} profile updated`);

  return {
    success: true,
    message: 'Profile updated successfully',
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phone,
      avatar: user.avatar,
      gender: user.gender,
    },
  };
};

export const updatePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.password) {
    throw new Error('This account uses OAuth login. Cannot change password.');
  }

  const isPasswordCorrect = await comparePassword(
    currentPassword,
    user.password
  );
  if (!isPasswordCorrect) {
    throw new Error('Current password is incorrect');
  }

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();

  logger.info(`User ${userId} password updated`);

  return {
    success: true,
    message: 'Password updated successfully',
  };
};

export const updateTwoFactorAuth = async (userId, enabled) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  user.twoFactorEnabled = enabled;
  await user.save();

  logger.info(`User ${userId} 2FA set to ${enabled}`);

  return {
    success: true,
    message: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'} successfully`,
    data: {
      twoFactorEnabled: enabled,
    },
  };
};

export const getActivityLog = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return {
    success: true,
    data: [],
  };
};

export const getHeritageJourneys = async (userId) => {
  return {
    success: true,
    data: [],
  };
};

export const getFavorites = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const favorites = user.favorites || [];

  const populatedFavorites = await Promise.all(
    favorites.map(async (favorite) => {
      try {
        let itemDetail = null;

        switch (favorite.itemType) {
          case 'experience':
            itemDetail = await Experience.findById(favorite.itemId).lean();
            break;
          case 'hotel':
            itemDetail = await Hotel.findById(favorite.itemId).lean();
            break;
          case 'tour':
            itemDetail = await Tour.findById(favorite.itemId).lean();
            break;
          case 'artisan':
            itemDetail = await Artisan.findById(favorite.itemId).lean();
            break;
        }

        return {
          _id: favorite._id,
          itemId: favorite.itemId,
          itemType: favorite.itemType,
          savedAt: favorite.savedAt,
          itemDetail: itemDetail || null,
        };
      } catch (error) {
        logger.error(`Error fetching ${favorite.itemType}:`, error.message);
        return {
          _id: favorite._id,
          itemId: favorite.itemId,
          itemType: favorite.itemType,
          savedAt: favorite.savedAt,
          itemDetail: null,
        };
      }
    })
  );

  return {
    success: true,
    data: populatedFavorites,
  };
};

export const addFavorite = async (userId, itemId, itemType) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const existingFavorite = user.favorites?.find(
    (fav) => fav.itemId.toString() === itemId && fav.itemType === itemType
  );

  if (existingFavorite) {
    return {
      success: false,
      message: 'Item already in favorites',
    };
  }

  user.favorites.push({
    itemId,
    itemType,
    savedAt: new Date(),
  });

  await user.save();

  return {
    success: true,
    message: 'Added to favorites successfully',
    data: user.favorites,
  };
};

export const removeFavorite = async (userId, favoriteId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  user.favorites =
    user.favorites?.filter((fav) => fav._id.toString() !== favoriteId) || [];

  await user.save();

  return {
    success: true,
    message: 'Removed from favorites successfully',
    data: user.favorites,
  };
};

export const getAllUsers = async (queryParams = {}) => {
  const {
    page = 1,
    limit = 10,
    role = null,
    status = null,
    search = null,
    sort = '-createdAt',
  } = queryParams;

  const filter = {};

  if (role) {
    filter.role = role;
  }

  if (status === 'active') {
    filter.isActive = true;
  } else if (status === 'inactive') {
    filter.isActive = false;
  }

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  try {
    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select(
        'firstName lastName email phone role isEmailVerified isActive createdAt avatar gender'
      )
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);
    const pages = Math.ceil(total / limit);

    const formattedUsers = users.map((user) => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
      avatar: user.avatar || null,
      gender: user.gender || 'other',
    }));

    logger.info(
      `Fetched users list: page ${page}, limit ${limit}, total ${total}`
    );

    return {
      success: true,
      data: formattedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages,
      },
    };
  } catch (error) {
    logger.error('[getAllUsers] Error:', error.message);
    throw error;
  }
};

export const getUserStats = async () => {
  try {
    const totalUsers = await User.countDocuments();

    const activeTourists = await User.countDocuments({
      role: 'customer',
      isActive: true,
    });

    const verifiedArtisans = await User.countDocuments({
      role: 'artisan',
      isEmailVerified: true,
    });

    const pendingApprovals = await User.countDocuments({
      role: 'customer',
      isEmailVerified: false,
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $lt: thirtyDaysAgo },
    });

    const newUsersThisMonth = totalUsers - lastMonthUsers;
    const growth =
      lastMonthUsers > 0
        ? Math.round((newUsersThisMonth / lastMonthUsers) * 100)
        : 0;

    logger.info(
      `User stats fetched - Total: ${totalUsers}, Active tourists: ${activeTourists}, Verified artisans: ${verifiedArtisans}`
    );

    return {
      success: true,
      data: {
        totalUsers,
        activeTourists,
        verifiedArtisans,
        pendingApprovals,
        growth,
      },
    };
  } catch (error) {
    logger.error('[getUserStats] Error:', error.message);
    throw error;
  }
};

export const createUser = async (userData) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    role = 'customer',
    artisanInfo = null,
  } = userData;

  if (!firstName || !lastName || !email || !password || !role) {
    throw new Error(
      'firstName, lastName, email, password, and role are required'
    );
  }

  if (role === 'artisan') {
    if (!artisanInfo?.category || !artisanInfo?.craft) {
      throw new Error('Category and craft are required for artisan role');
    }
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const userGender = gender || 'other';

  const avatar = null;

  try {
    const hashedPassword = await hashPassword(password);

    const emailOTP = generateOTP();
    const emailOTPExpire = getOTPExpiration();

    const newUser = new User({
      firstName,
      lastName,
      email,
      phone: phone || '',
      gender: userGender,
      avatar: avatar,
      role,
      password: hashedPassword,
      isEmailVerified: role === 'artisan' ? true : false,
      isFirstLogin: true,
      isActive: role === 'artisan' ? true : false,
      emailOTP,
      emailOTPExpire,
    });

    await newUser.save();

    if (role === 'artisan' && artisanInfo) {
      const newArtisan = new Artisan({
        userId: newUser._id,
        category: artisanInfo.category,
        craft: artisanInfo.craft,
        slogan: artisanInfo.slogan || '',
        storytelling: artisanInfo.storytelling || '',
        experienceYears: artisanInfo.experienceYears || 0,
        skills: artisanInfo.skills || [],
        province: artisanInfo.province || '',
        village: artisanInfo.village || '',
        location: artisanInfo.location || {
          type: 'Point',
          coordinates: [0, 0],
        },
        workshopLocation: artisanInfo.workshopLocation || {
          address: '',
          description: '',
        },
        isVerified: artisanInfo.isVerified || false,
        title: artisanInfo.title || '',
        certifyingOrganization: artisanInfo.certifyingOrganization || '',
        proofImages: artisanInfo.proofImages || [],
        // avatar removed - now inherited from User via userId populate
        images: artisanInfo.images || [],
        generation: artisanInfo.generation || 1,
        verificationStatus: artisanInfo.verificationStatus || 'approved',
        responseRate: 100,
      });

      await newArtisan.save();
      logger.info(
        `Artisan created for user: ${email} with category: ${artisanInfo.category}`
      );
    }

    await sendVerifyEmailLink(email, emailOTP);

    logger.info(
      `User created: ${email} by admin with role: ${role}. Verification email sent with OTP: ${emailOTP}`
    );

    return {
      success: true,
      message:
        'User created successfully. Verification email sent. Please check your email to complete account activation.',
      data: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
        isEmailVerified: newUser.isEmailVerified,
      },
    };
  } catch (error) {
    logger.error('[createUser] Error:', error.message);
    throw error;
  }
};

export const updateUserById = async (userId, updateData) => {
  const {
    firstName,
    lastName,
    phone,
    role,
    isActive,
    avatar,
    gender,
    artisanInfo = null,
  } = updateData;

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  try {
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (role !== undefined && role !== 'admin') user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (avatar !== undefined) user.avatar = avatar;
    if (gender !== undefined) user.gender = gender;

    await user.save();

    if (user.role === 'artisan' && artisanInfo) {
      const existingArtisan = await Artisan.findOne({ userId });

      if (existingArtisan) {
        Object.assign(existingArtisan, {
          category: artisanInfo.category || existingArtisan.category,
          craft: artisanInfo.craft || existingArtisan.craft,
          slogan:
            artisanInfo.slogan !== undefined
              ? artisanInfo.slogan
              : existingArtisan.slogan,
          storytelling:
            artisanInfo.storytelling !== undefined
              ? artisanInfo.storytelling
              : existingArtisan.storytelling,
          experienceYears:
            artisanInfo.experienceYears !== undefined
              ? artisanInfo.experienceYears
              : existingArtisan.experienceYears,
          skills: artisanInfo.skills || existingArtisan.skills,
          province:
            artisanInfo.province !== undefined
              ? artisanInfo.province
              : existingArtisan.province,
          village:
            artisanInfo.village !== undefined
              ? artisanInfo.village
              : existingArtisan.village,
          location: artisanInfo.location || existingArtisan.location,
          workshopLocation:
            artisanInfo.workshopLocation || existingArtisan.workshopLocation,
          isProfileVerified:
            artisanInfo.isProfileVerified !== undefined
              ? artisanInfo.isProfileVerified
              : existingArtisan.isVerified,
          title:
            artisanInfo.title !== undefined
              ? artisanInfo.title
              : existingArtisan.title,
          certifyingOrganization:
            artisanInfo.certifyingOrganization !== undefined
              ? artisanInfo.certifyingOrganization
              : existingArtisan.certifyingOrganization,
          proofImages: artisanInfo.proofImages || existingArtisan.proofImages,
        });
        await existingArtisan.save();
        logger.info(`Artisan profile updated for user: ${userId}`);
      } else {
        const newArtisan = new Artisan({
          userId,
          category: artisanInfo.category,
          craft: artisanInfo.craft,
          slogan: artisanInfo.slogan || '',
          storytelling: artisanInfo.storytelling || '',
          experienceYears: artisanInfo.experienceYears || 0,
          skills: artisanInfo.skills || [],
          province: artisanInfo.province || '',
          village: artisanInfo.village || '',
          location: artisanInfo.location || {
            type: 'Point',
            coordinates: [0, 0],
          },
          workshopLocation: artisanInfo.workshopLocation || {
            address: '',
            description: '',
          },
          isProfileVerified: artisanInfo.isProfileVerified || false,
          title: artisanInfo.title || '',
          certifyingOrganization: artisanInfo.certifyingOrganization || '',
          proofImages: artisanInfo.proofImages || [],
        });
        await newArtisan.save();
        logger.info(`Artisan profile created for user: ${userId}`);
      }
    }

    logger.info(`User ${userId} updated by admin`);

    return {
      success: true,
      message: 'User updated successfully',
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        avatar: user.avatar,
        gender: user.gender,
      },
    };
  } catch (error) {
    logger.error('[updateUserById] Error:', error.message);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  try {
    await User.deleteOne({ _id: userId });

    logger.info(`User ${userId} deleted by admin`);

    return {
      success: true,
      message: 'User deleted successfully',
      data: {
        id: userId,
      },
    };
  } catch (error) {
    logger.error('[deleteUser] Error:', error.message);
    throw error;
  }
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select(
    'firstName lastName email phone avatar gender role isEmailVerified isActive createdAt'
  );

  if (!user) {
    throw new Error('User not found');
  }

  try {
    let artisanInfo = null;
    if (user.role === 'artisan') {
      artisanInfo = await Artisan.findOne({ userId }).lean();
    }

    logger.info(`User ${userId} requested by admin`);

    return {
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        gender: user.gender,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        ...(artisanInfo && { artisanInfo }),
      },
    };
  } catch (error) {
    logger.error('[getUserById] Error:', error.message);
    throw error;
  }
};

export const verifyEmailOTP = async (email, otp) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isEmailVerified) {
      throw new Error('Email already verified');
    }

    if (!user.emailOTP) {
      throw new Error('No OTP found. Please request a new verification code.');
    }

    if (new Date() > user.emailOTPExpire) {
      throw new Error('OTP expired. Please request a new verification code.');
    }

    if (user.emailOTP !== otp) {
      throw new Error('Invalid OTP');
    }

    user.isEmailVerified = true;
    user.isActive = true;
    user.emailOTP = null;
    user.emailOTPExpire = null;
    await user.save();

    logger.info(`User ${email} email verified successfully`);

    return {
      success: true,
      message: 'Email verified successfully. Account is now active!',
      data: {
        id: user._id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
      },
    };
  } catch (error) {
    logger.error('[verifyEmailOTP] Error:', error.message);
    throw error;
  }
};

export const getAdminUser = async () => {
  try {
    const adminUser = await User.findOne({ role: 'admin' }).select(
      'firstName lastName email phone role'
    );

    if (!adminUser) {
      const staffUser = await User.findOne({ role: 'staff' }).select(
        'firstName lastName email phone role'
      );

      if (!staffUser) {
        throw new Error('No admin or staff user available for support chat');
      }

      return {
        success: true,
        data: {
          _id: staffUser._id,
          firstName: staffUser.firstName,
          lastName: staffUser.lastName,
          email: staffUser.email,
          phone: staffUser.phone || '',
          role: staffUser.role,
        },
      };
    }

    return {
      success: true,
      data: {
        _id: adminUser._id,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        email: adminUser.email,
        phone: adminUser.phone || '',
        role: adminUser.role,
      },
    };
  } catch (error) {
    logger.error('[getAdminUser] Error:', error.message);
    throw error;
  }
};
