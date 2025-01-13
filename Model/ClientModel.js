const mongoose = require("mongoose");
const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    phoneNo: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    companyName: {
      type: String,
    },
    companyAddress: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      zipCode: {
        type: Number,
      },
    },
    totalEmployees: {
      type: Number,
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
  },
  { timestamps: true }
);


const clientModel = mongoose.model("Client", clientSchema);

module.exports = clientModel;
