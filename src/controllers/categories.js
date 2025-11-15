import { Category } from "../models/category.js";

export async function listStoryCategoriesController(req, res, next) {
  try {
    const categories = await Category.find(
        {}, 
        "_id name", 
        { sort: { name: 1 } }
    ).lean();

    res.status(200).json({
      status: 200,
      message: "Successfully found story categories!",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}