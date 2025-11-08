import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Story } from '../models/story.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export async function getPublicUsers({ page, perPage }) {
  const q = User.find().select('-password');
  const [count, users] = await Promise.all([
    User.countDocuments(),
    q
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean(),
  ]);
  return { data: users, ...calculatePaginationData(count, perPage, page) };
}

export async function getPublicUserById(userId, { page, perPage }) {
  const user = await User.findById(userId).select('-password').lean();
  if (!user) throw createHttpError(404, 'User not found');

  const storiesQ = Story.find({ ownerId: userId }).sort({ createdAt: -1 });
  const [count, stories] = await Promise.all([
    Story.countDocuments({ ownerId: userId }),
    storiesQ
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean(),
  ]);

  return {
    user,
    stories: {
      data: stories,
      ...calculatePaginationData(count, perPage, page),
    },
  };
}

export async function getMe(userId) {
  const me = await User.findById(userId).select('-password').lean();
  if (!me) throw createHttpError(404, 'User not found');
  return me;
}

export async function updateMe(userId, payload) {
  const updated = await User.findByIdAndUpdate(userId, payload, { new: true })
    .select('-password')
    .lean();
  if (!updated) throw createHttpError(404, 'User not found');
  return updated;
}

export async function addSavedStory(userId, storyId) {
  const updated = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { savedStories: storyId } },
    { new: true }
  )
    .select('-password')
    .lean();
  if (!updated) throw createHttpError(404, 'User not found');
  return updated;
}

export async function removeSavedStory(userId, storyId) {
  const updated = await User.findByIdAndUpdate(
    userId,
    { $pull: { savedStories: storyId } },
    { new: true }
  )
    .select('-password')
    .lean();
  if (!updated) throw createHttpError(404, 'User not found');
  return updated;
}
