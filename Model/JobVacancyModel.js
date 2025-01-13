const mongoose = require("mongoose");
const { Schema } = mongoose;

const num = 6;
let randomNumber = "";
for (let i = 0; i < num; i++) {
  const ranNumber = Math.floor(Math.random() * 9) + 1;
  randomNumber += ranNumber;
}

const jobVacancySchema = new Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    vacancyAnnouncement: {
      type: String,
    },
    jobId: {
      type: String,
      default: "JOB" + randomNumber,
    },
    note: {
      type: String,
    },
    employer: {
      type: String,
    },
    noOfPosition: {
      type: Number,
    },
    positionName: {
      type: String,
    },
    jobProfileImage: {
      type: String,
    },
    responsibilities: {
      type: String,
    },
    qualifications: {
      type: String,
    },
    location: {
      type: String,
    },
    annualLeave: {
      type: Number,
    },
    publicHoliday: {
      type: String,
    },
    companyType: {
      type: String,
      enum: [
        "Startup",
        "SME",
        "Corporate",
        "Non-profit",
        "Freelance",
        "Public Sector",
        "Private Sector",
        "Government",
        "Educational",
        "Cooperative",
      ],
    },
    salary: {
      maxPay: {
        type: Number,
        default: 0,
      },
      minPay: {
        type: Number,
        default: 0,
      },
    },
    reportingTo: {
      type : String
    },
    workingDaysAndHours: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    positionType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
    },
    experience: {
      type: String 
    },
    applyTo : {
      type : String
    },
    communication : {
      type :  String
    },
    applied : {
      type : Number,
      enum : [0,1],
      default : 0
    }
  },
  { timestamps: true }
);

const JobVacancy = mongoose.model("JobVacancy", jobVacancySchema);

module.exports = JobVacancy;
