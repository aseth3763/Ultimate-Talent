const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    participantName: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    profileImage : {
        type :String
    },
    city: {
      type: String,
    },
    communicationLanguage: {
      type: String,
    },
    paymentType: {
      type: String,
      enum: ["Cash", "FIB", "Bank Transfer", "Other"],
    },
    cvUrl: {
      type: String,
    },
    linkedinProfileUrl: {
      type: String,
    },
    hearAbout:{
        type : String
    },
    trainingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Training",
      required : true
    },
    userId  : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "user" 
    },
    note : {
      type : String
    }
  },
  { timestamps: true }
);

const Registration = mongoose.model("trainingRegistration", registrationSchema);

module.exports = Registration;
