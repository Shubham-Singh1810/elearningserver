const mongoose = require("mongoose");
const Course = require("../Model/courseSchema");


exports.create = async (body) => {
  return await Course.create(body);
};
exports.updateCourse = async (id, query) => {
    return await Course.findByIdAndUpdate(id, query, { new: true });
};
exports.getById = async (query) => {
    return await Course.findOne(query).populate({ path: "Category" });
};
exports.getCourseList = async (query) => {
    return await Course.find(query);
};
exports.deleteCourse = async (id) => {
  return await Course.deleteOne(id);
};