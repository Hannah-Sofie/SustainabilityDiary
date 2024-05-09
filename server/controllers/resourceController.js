const CreateError = require("../utils/createError");
const Resource = require("../models/resourceSchema");

const createResource = async (req, res, next) => {
  const { title, link } = req.body;
  if (!title || !link) {
    return next(new CreateError("Title and link are required.", 400));
  }

  try {
    const resource = new Resource({ title, link });
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    next(new CreateError("Failed to create resource.", 500));
  }
};

const getAllResources = async (req, res, next) => {
  try {
    const resources = await Resource.find({});
    res.json(resources);
  } catch (error) {
    next(new CreateError("Failed to fetch resources.", 500));
  }
};

module.exports = { createResource, getAllResources };
