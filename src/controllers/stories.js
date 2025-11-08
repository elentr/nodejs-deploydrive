import { getStories, createStory, updateStory } from '../services/stories.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export async function listStoriesController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { category } = req.query;

  const data = await getStories({ page, perPage, category });
  res.json({ status: 200, message: 'Successfully found stories!', data });
}

export async function createStoryController(req, res) {
  if (!req.file) {
    return res
      .status(400)
      .json({ status: 400, message: 'storyImage is required', data: {} });
  }
  const img = await uploadToCloudinary(req.file);

  const payload = {
    title: req.body.title,
    article: req.body.article,
    category: req.body.category,
    img,
  };

  const data = await createStory(req.user._id, payload);
  res
    .status(201)
    .json({ status: 201, message: 'Successfully created a story!', data });
}

export async function updateStoryController(req, res) {
  let img;
  if (req.file) img = await uploadToCloudinary(req.file);

  const payload = { ...req.body };
  if (img) payload.img = img;

  const data = await updateStory(req.params.storyId, req.user._id, payload);
  res.json({ status: 200, message: 'Successfully updated a story!', data });
}
