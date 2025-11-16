import createHttpError from 'http-errors';
import { Story } from '../models/story.js';
import { Category } from '../models/category.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export async function getStories({ page, perPage, category }) {
  const filter = {};

  if (category) {
    filter.category = category;
  }

  const q = Story.find(filter);

  const [count, items, categories] = await Promise.all([
    Story.countDocuments(filter),
    q
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean(),
    Category.find().lean(),
  ]);

  const categoryMap = Object.fromEntries(
    categories.map(c => [c._id.toString(), c.name])
  );

  const itemsWithCategoryName = items.map(story => ({
    ...story,
    categoryName: categoryMap[story.category] || 'Unknown',
  }));

  return {
    data: itemsWithCategoryName,
    ...calculatePaginationData(count, perPage, page),
  };
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

export async function getPopularStories({ page, perPage }) {
  const skip = (page - 1) * perPage;

  const stories = await Story.find({})
    .sort({ favoriteCount: -1 })
    .skip(skip)
    .limit(perPage)
    .lean();

  const total = await Story.countDocuments();
  const hasNextPage = page * perPage < total;

  return {
    stories,
    total,
    page,
    perPage,
    hasNextPage,
  };
}
