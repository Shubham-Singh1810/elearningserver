const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const courseSchema = mongoose.Schema({
    Icon: {type: String},
    Name:{type:String},
    Discription:{type:String},
    Price:{type:String},
    Duration:{type:String},
    StartDate:{type:String},
    ClassTiming:{type:String},
    EndDate:{type:String},
    Author: { type: String, ref: "User" },
    Topics:[{ type: String, ref: "Topics" }],
    AddedBy:[{ type: String, ref: "User" }],
    BuyedBy:[{ type: String, ref: "User" }],
    IsLive:{type:Boolean},
    Category:[{ type: String, ref: "Category" }]
});

courseSchema.plugin(timestamps);
module.exports = mongoose.model("Course", courseSchema);

