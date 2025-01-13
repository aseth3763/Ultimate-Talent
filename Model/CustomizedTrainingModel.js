const mongoose = require("mongoose");

const trainingRequestSchema = new mongoose.Schema(
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
    city: {
      type: String,
    },
    trainingType: {
      type: String,
      enum: ["Online", "Classroom"],
    },
    trainingDays: {
      type: [String],
      enum: [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
      ],
    },
    trainingTime: {
      from: {
        type: String,
      },
      to : {
        type: String,
      }
    },
    // trainingName: {
    //   type: String,
    // },
    participantType: {
      type: String,
      enum: ["Individual",  "Organization"],
    },
    numberOfParticipants: {
      type: Number,
    },
    trainingLocation: {
      type: String,
    },
    description: {
      type: String,
    },
    trainingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Training",
      required: true,
    },
    userId : {
      type : mongoose.Schema.Types.ObjectId,
      ref  : "user"
    }
  },
  { timestamps: true }
);

const TrainingRequest = mongoose.model(
  "TrainingRequest",
  trainingRequestSchema
);

module.exports = TrainingRequest;
