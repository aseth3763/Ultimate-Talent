const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema(
  {
    trainerName: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    city: {
      type: String,
    },
    trainingType: {
      type: String,
      enum: ["Personal", "Online", "In Class"],
    },
    availableDays: {
      type: [String],
      enum: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    },
    experience: [
      {
        employer: { type: String }, 
        location: { type: String },  
        month: { type: Number },   
        year: { type: Number },   
        topics: { type: String }               
      }
    ],
    cv: {
      type: String,
    },
    certificates: {
      type: [String],
    },
    trainingTopics: {
      type: String
    },
    profileImage : {
        type : String
    },
    userId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "user"
    },
    availableTimesDetail: {
        type : [String],
          enum: ["9:30 am to 12:30 pm","2:00 pm to 5:00 pm","5:30 pm to 8:00 pm","Full Day (6-8 Hours)"],
  }},{timestamps: true }
);

const Trainer = mongoose.model("Trainer", trainerSchema);

module.exports = Trainer;
