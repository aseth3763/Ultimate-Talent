const mongoose = require("mongoose");

const cvSubmitSchema = new mongoose.Schema({
  applicantName: {
    type: String,
  },
  nationality: {
    type: String,
  },
  phoneNo: {
    type: Number,
  },
  email: {
    type: String,
  },
  city: {
    type: String,
  },
  address: {
    type: String,
  },
  education: {
    degree: {
      type: String,
    },
    branch: {
      type: String,
    },
    university: {
      type: String,
    },
    college : {
        type : String
    },
    graduationYear: {
      type: Number,
    },
    location: {
      type: String,
    },
    cgpa: {
      type: Number,
    },
  },
  languageSkill : [{
    name : {
      type : String
    },
    fluencyLevel : {
      type : String,
      enum : ["Native","Fluent","Very Good","Good","Fair","Basic"]
    }
  }],
  cv : {
    type : String
  },
  userId : {
    type : mongoose.Schema.Types.ObjectId ,
    ref : "user"
  }
},{timestamps:true});

const cvSubmitModel = mongoose.model("cvSubmitModel",cvSubmitSchema)

module.exports = cvSubmitModel;

