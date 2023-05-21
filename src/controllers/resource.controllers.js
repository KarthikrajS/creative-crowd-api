import expressAsyncHandler from "express-async-handler";
import Resource from "../models/Resource.js";

export const createResource = async (data) => {
  const { title, description, url, type } = data;
  const resource = new Resource({ title, description, url, type });
  try {
    const newResource = await resource.save();
    return newResource;
  } catch (err) {
    throw new Error(err.message);
  }
};
