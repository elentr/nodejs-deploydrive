import {
  getPublicUsers,
  getPublicUserById,
  getMe,
  updateMe,
  addSavedStory,
  removeSavedStory,
} from '../services/users.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { User } from '../models/user.js';
import { Story } from '../models/story.js';

export async function listUsersController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const data = await getPublicUsers({ page, perPage });
  res.json({ status: 200, message: 'Successfully found users!', data });
}

export async function getUserByIdController(req, res) {
  const { userId } = req.params;
  const { page, perPage } = parsePaginationParams(req.query);
  const data = await getPublicUserById(userId, { page, perPage });
  res.json({ status: 200, message: 'Successfully found user!', data });
}

export async function meController(req, res, next) {
  try {
    const user = await getMe(req.user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl ?? null,
      description: user.description ?? '',
      articlesAmount: user.articlesAmount ?? 0,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateMeController(req, res, next) {
  try {
    const userId = req.user._id;

    let avatarUrl = req.body.avatarUrl || null;

    if (req.file) {
      if (req.file.size > 500 * 1024) {
        return res.status(400).json({
          status: 400,
          message: 'Avatar too large (max 500kB)',
          data: {},
        });
      }

      avatarUrl = await uploadToCloudinary(req.file);
    }

    const updated = await updateMe(userId, {
      name: req.body.name,
      email: req.body.email,
      description: req.body.description,
      avatarUrl,
    });

    res.json({
      status: 200,
      message: 'Successfully updated user!',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateAvatarController(req, res) {
  if (req.file && req.file.size > 500 * 1024) {
    return res
      .status(400)
      .json({ status: 400, message: 'Avatar too large (max 500kB)', data: {} });
  }
  let avatarUrl = null;
  if (req.file) avatarUrl = await uploadToCloudinary(req.file);
  const data = await updateMe(req.user._id, { avatarUrl });
  res.json({ status: 200, message: 'Successfully updated avatar!', data });
}

export async function addSavedController(req, res) {
  const data = await addSavedStory(req.user._id, req.params.storyId);
  res.json({ status: 200, message: 'Story saved!', data });
}

export async function removeSavedController(req, res) {
  const data = await removeSavedStory(req.user._id, req.params.storyId);
  res.json({ status: 200, message: 'Story removed!', data });
}

export async function getUserByIdStory(req, res) {
  try {
    const { userId } = req.params;
    const { page, perPage } = parsePaginationParams(req.query);

    const user = await User.findById(userId).select('_id name avatarUrl');

    if (!user) {
      return res
        .status(404)
        .json({ status: 404, message: 'User not found', data: {} });
    }

    const stories = await Story.find({ ownerId: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    const totalStories = await Story.countDocuments({ ownerId: userId });

    const data = {
      user,
      stories,
      pagination: {
        page,
        perPage,
        totalPages: Math.ceil(totalStories / perPage),
        totalStories,
      },
    };

    return res.status(200).json({
      status: 200,
      message: 'Successfully found user stories!',
      data,
    });
  } catch (error) {
    console.error('Error fetching user stories:', error.message);
    return res.status(500).json({
      status: 500,
      message: 'Server error',
      error: error.message,
    });
  }
}
