const CreateError = require("../utils/createError");
const Resource = require("../models/resourceSchema");

// Create a new resource
const createResource = async (req, res, next) => {
  const { title, link } = req.body;

  // Check if title and link are provided
  if (!title || !link) {
    return next(new CreateError("Title and link are required.", 400));
  }

  try {
    // Create and save the new resource
    const resource = new Resource({ title, link });
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    next(new CreateError("Failed to create resource.", 500));
  }
};

// Get all resources
const getAllResources = async (req, res, next) => {
  try {
    // Fetch all resources from the database
    const resources = await Resource.find({});
    res.json(resources);
  } catch (error) {
    next(new CreateError("Failed to fetch resources.", 500));
  }
};

// Update an existing resource
const updateResource = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find and update the resource by ID
    const updatedResource = await Resource.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    
    // If the resource is not found, return a 404 error
    if (!updatedResource) {
      return next(new CreateError("Resource not found", 404));
    }

    // Return the updated resource
    res.json(updatedResource);
  } catch (error) {
    next(new CreateError("Failed to update resource", 500));
  }
};

// Delete a resource
const deleteResource = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find and delete the resource by ID
    const deletedResource = await Resource.findByIdAndDelete(id);

    // If the resource is not found, return a 404 error
    if (!deletedResource) {
      return next(new CreateError("Resource not found", 404));
    }

    // Send a 204 No Content status on successful deletion
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
