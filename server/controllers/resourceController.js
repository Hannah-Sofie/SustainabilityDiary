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

const updateResource = async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedResource = await Resource.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedResource) {
      return next(new CreateError("Resource not found", 404));
    }
    res.json(updatedResource);
  } catch (error) {
    next(new CreateError("Failed to update resource", 500));
  }
};

const deleteResource = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedResource = await Resource.findByIdAndDelete(id);
    if (!deletedResource) {
      return next(new CreateError("Resource not found", 404));
    }
    res.status(204).send();
  } catch (error) {
    next(new CreateError("Failed to delete resource", 500));
  }
};

module.exports = {
  createResource,
  getAllResources,
  updateResource,
  deleteResource,
};
