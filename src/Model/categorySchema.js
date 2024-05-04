const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const categorySchema = mongoose.Schema({
    Icon: {type: String},
    Name:{type:String},
    Courses:[{ type: String, ref: "Course" }],
});

categorySchema.plugin(timestamps);
module.exports = mongoose.model("Category", categorySchema);

