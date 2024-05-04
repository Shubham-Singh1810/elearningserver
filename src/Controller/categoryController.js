const express = require("express");
const postController = express.Router();
const categoryController = express.Router();
const auth = require("../middleware/auth");
const {
  sendResponse,
  generateOTP,
  sendMail
} = require("../Utils/common");
// const imgUpload = require("../Utils/multer")
const upload = require("../Utils/multer")
const User = require("../Model/userSchema");
const Post = require("../Model/postSchema");
const Category = require("../Model/categorySchema");
const TagData = require("../Model/tagSchema");
const LocationData = require("../Model/locationSchema");
const postService = require("../Services/postService");
const categoryService = require("../Services/categoryService");
const userService = require("../Services/userService")
const { body } = require("express-validator");
const cloudinary = require("../Utils/cloudinary");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });


categoryController.post("/create",
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
      const CategoryCreated = await Category.create(obj);
      sendResponse(res, 200, "Success", {
        message: "Category created successfully!",
        CategoryData: CategoryCreated,
      });
    } catch (error) {
      console.error(error);
      sendResponse(res, 500, "Failed", {
        message: error.message || "Internal server error",
      });
    }
});

categoryController.post("/list", async (req, res) => {
  try {
    const data = await categoryService.getCategoryList({});
    sendResponse(res, 200, "Success", {
      message: "Category retrieved successfully!",
      data: data,
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});

categoryController.get("/:id", async (req, res) => {
  try {
    const _id  = req.params.id;
    const data = await categoryService.getById({ _id });
    sendResponse(res, 200, "Success", {
      message: "Category details retrieved successfully!",
      data: data,
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});

categoryController.put("/updateCategory",upload.single("Icon"), async (req, res) => {
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
    console.log(req.body)
    const category = await Category.findOne({_id: req.body._id});
    if(!category){
      return (
        sendResponse(res, 404, "Failed", {
          message: "Category Not found",
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

categoryController.delete("/delete", async (req, res) => {
  try {
    const data = await categoryService.deleteCategory({ _id: req.body.categoryId });
    sendResponse(res, 200, "Success", {
      message: "Category deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
}
);
module.exports = categoryController;