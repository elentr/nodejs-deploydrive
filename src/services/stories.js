import createHttpError from 'http-errors';
import { Story } from '../models/story.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export async function getStories({ page, perPage, category }) {
  const q = Story.find();
  if (category) {
    const ids = category.split(',').filter(Boolean);
    q.where('category').in(ids);
  }

  const [count, items] = await Promise.all([
    Story.find().merge(q).countDocuments(),
    q
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean(),
  ]);

  return { data: items, ...calculatePaginationData(count, perPage, page) };
}

export async function createStory(ownerId, payload) {
  const doc = await Story.create({ ...payload, ownerId });
  return doc.toObject();
}

export async function updateStory(storyId, ownerId, payload) {
  const updated = await Story.findOneAndUpdate(
    { _id: storyId, ownerId },
    payload,
    { new: true }
  ).lean();
  if (!updated) throw createHttpError(404, 'Story not found');
  return updated;
}
