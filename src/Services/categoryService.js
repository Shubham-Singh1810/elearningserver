const mongoose = require("mongoose");
const Category = require("../Model/categorySchema");


exports.create = async (body) => {
  return await Category.create(body);
};
exports.updateCategory = async (id, query) => {
    return await Category.findByIdAndUpdate(id, query, { new: true });
};
exports.getById = async (query) => {
    return await Category.findOne(query).populate({ path: "Courses" });
};
exports.getCategoryList = async (query) => {
    return await Category.find(query);
};
exports.deleteCategory = async (id) => {
  return await Category.deleteOne(id);
};