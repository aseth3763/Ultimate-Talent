const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    trainingId: {
      type: String,
      default: function () {
        const num = 6;
        let randomNumber = "";
        for (let i = 0; i < num; i++) {
          const ranNumber = Math.floor(Math.random() * 9) + 1;
          randomNumber += ranNumber;
        }
        return "TRAINING" + randomNumber;
      },
    },
    
    trainingName: {
      type: String,
    },
    certificateStandard : {
      type : String
    },
    courseContent : {
      type : String
    },
    courseOverview : {
      type : String
    },
    benefits : {
      type : String
    },
    trainingLanguage : {
      type : String
    },
    type: {
      type: String,
      enum: ["Online", "Classroom"],
    },
    location: {
      type: String,
    },
    trainingStartDate: {
      type: Date,
    },
    duration: {
      type: String,
    },
    trainingLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    trainingPrice: {
      type: Number,
    },
    image: {
      type: String,
    },
    paymentMethod : {
      type : String
    },
    whoShouldAttend : {
      type : String
    },
    registered : {
      type : Number,
      enum : [0,1],
      default : 0
    }
  },
  { timestamps: true }
);

const trainingCourseModel = mongoose.model("Training", trainingSchema);

module.exports = trainingCourseModel;
