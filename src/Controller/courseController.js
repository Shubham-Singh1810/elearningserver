const express = require("express");
const courseController = express.Router();
const auth = require("../middleware/auth");
const {
  sendResponse,
  generateOTP,
  sendMail
} = require("../Utils/common");
const upload = require("../Utils/multer")
const User = require("../Model/userSchema");
const Post = require("../Model/postSchema");
const Course = require("../Model/courseSchema");
const courseService = require("../Services/courseService");
const userService = require("../Services/userService")
const { body } = require("express-validator");
const categoryService = require("../Services/categoryService");
const cloudinary = require("../Utils/cloudinary");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });


courseController.post("/create",
  upload.single("Icon"),
  async (req, res) => {
    try {
      let obj;
      if (req.file) {
        let Icon = await cloudinary.uploader.upload(req.file.path, function (err, result) {
          if (err) {
            return err;
          } else {
            return result;
          }
        });
        obj = { ...req.body, Icon: Icon.url };
      }
      const courseCreated = await Course.create(obj);
      await categoryService.updateCategory({ _id: obj?.Category}, { $push: { Courses: courseCreated?._id } });
      sendResponse(res, 200, "Success", {
        message: "Course created successfully!",
        CourseCreated: courseCreated,
      });
    } catch (error) {
      console.error(error);
      sendResponse(res, 500, "Failed", {
        message: error.message || "Internal server error",
      });
    }
});

courseController.post("/list", async (req, res) => {
  try {
    const data = await courseService.getCourseList({});
    sendResponse(res, 200, "Success", {
      message: "Course retrieved successfully!",
      data: data,
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});

courseController.get("/:id", async (req, res) => {
  try {
    const _id  = req.params.id;
    const data = await courseService.getById({ _id });
    sendResponse(res, 200, "Success", {
      message: "Course details retrieved successfully!",
      data: data,
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});

courseController.put("/updateCourse",upload.single("Icon"), async (req, res) => {
  try {
    let obj = req.body;
    if (req.file) {
      let Icon = await cloudinary.uploader.upload(req.file.path, function (err, result) {
        if (err) {
          return err;
        } else {
          return result;
        }
      });
      obj = { ...req.body , Icon:Icon.url };
    }
    const course = await Course.findOne({_id: req.body._id});
    if(!course){
      return (
        sendResponse(res, 404, "Failed", {
          message: "Course Not found",
        })
      )
    }
    
    const data = await categoryService.updateCategory(req.body._id ,{ $set: obj } );
    sendResponse(res, 200, "Success", {
      message: "Category updated successfully!",
      data: data,
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});

// categoryController.delete("/delete", async (req, res) => {
//   try {
//     const data = await categoryService.deleteCategory({ _id: req.body.categoryId });
//     sendResponse(res, 200, "Success", {
//       message: "Category deleted successfully!",
//     });
//   } catch (error) {
//     console.log(error);
//     sendResponse(res, 500, "Failed", {
//       message: error.message || "Internal server error",
//     });
//   }
// }
// );
module.exports = courseController;