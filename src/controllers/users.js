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

export async function meController(req, res) {
  const data = await getMe(req.user._id);
  res.json({ status: 200, message: 'Successfully found current user!', data });
}

export async function updateMeController(req, res) {
  const data = await updateMe(req.user._id, req.body);
  res.json({ status: 200, message: 'Successfully updated user!', data });
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
