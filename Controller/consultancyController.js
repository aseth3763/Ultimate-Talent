const jobVacancyModel = require("../Model/JobVacancyModel");
const trainingCourseModel = require("../Model/TrainingModel");
const hrArticleModel = require("../Model/HrArticleModel");
const activityModel = require("../Model/LatestActivityModel");
const clientModel = require("../Model/ClientModel");
const Registration = require("../Model/TrainingRegistration");
const TrainingRequest = require("../Model/CustomizedTrainingModel");
const TrainerRegitrationModel = require("../Model/TrainerRegistrationModel");
const UserModel = require("../Model/UserModel");
const OtpClientModel = require("../Model/OtpModelClient");
const OtpUserModel = require("../Model/OtpModelUser");
const userModel = require("../Model/UserModel");
const contactUsModel = require("../Model/contactUsModel");
const cvSubmitModel = require("../Model/CvModel");
const bannerModel = require("../Model/BannerModel")
const aboutModel = require("../Model/AboutModel")
const footerModel = require("../Model/FooterModel")
const applicantCvModel = require("../Model/ApplicantCvProfile");
const admin_otp_email = require("../utils/otp_email");
const bcrypt = require("bcrypt");

// create a new job vacancy

const createJobVacancy = async (req, res) => {
  try {
    const {
      vacancyAnnouncement,
      employer,
      noOfPosition,
      responsibilities,
      qualifications,
      annualLeave,
      publicHoliday,
      name,
      email,
      positionName,
      positionType,
      location,
      companyType,
      maxPay,
      minPay,
      startDate,
      endDate,
      experience,
      note,
      reportingTo,
      workingDaysAndHours,
      applyTo,
      communication,
      applied
    } = req.body;

    console.log(typeof noOfPosition)
    if (!positionType) {
      return res
        .status(400)
        .json({ success: false, message: "Position type is required" });
    }

    if (!positionName) {
      return res
        .status(400)
        .json({ success: false, message: "Position name is required" });
    }
    if (!location) {
      return res
        .status(400)
        .json({ success: false, message: "Location is required" });
    }
    if (!companyType) {
      return res
        .status(400)
        .json({ success: false, message: "Company type is required" });
    }
    if (!startDate) {
      return res
        .status(400)
        .json({ success: false, message: "Start date is required" });
    }
    if (!applyTo) {
      return res
        .status(400)
        .json({ success: false, message: "apply to is required" });
    }
    if (!communication) {
      return res
        .status(400)
        .json({ success: false, message: "communication is required" });
    }
    if (!endDate) {
      return res
        .status(400)
        .json({ success: false, message: "End date is required" });
    }
    if (!experience) {
      return res
        .status(400)
        .json({ success: false, message: "Experience is required" });
    }
    if (maxPay === undefined || maxPay === null) {
      return res
        .status(400)
        .json({ success: false, message: "Max pay is required" });
    }
    if (minPay === undefined || minPay === null) {
      return res
        .status(400)
        .json({ success: false, message: "Min pay is required" });
    }
    if (Number(maxPay) < Number(minPay)) {
      return res.status(400).json({
        success: false,
        message: "Max pay must be greater than or equal to min pay",
      });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Start date must be before end date",
      });
    }

    console.log(req.file);
    let jobProfileImage = "";
    if (req.file) {
      const file = req.file;
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message:
            "Job profile image must be an image file (JPEG, PNG, or GIF)",
        });
      }

      jobProfileImage = file.filename;
      
    } else {
      return res.status(400).json({
        success: false,
        message: "job profile image is required",
      });
    }

    const { clientId } = req.params;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client Id is required",
      });
    }

    const existingData = await jobVacancyModel.findOne({
      positionName,
      clientId,
      startDate,
    });

    if (existingData) {
      return res
        .status(400)
        .json({ success: false, message: "Job vacancy already exists" });
    }

    const newJobVacancy = new jobVacancyModel({
      clientId,
      vacancyAnnouncement,
      employer,
      noOfPosition,
      responsibilities,
      qualifications,
      annualLeave,
      publicHoliday,
      name,
      email,
      positionName,
      positionType,
      location,
      companyType,
      salary: { maxPay, minPay },
      startDate,
      endDate,
      jobProfileImage,
      experience,
      note,
      reportingTo,
      workingDaysAndHours,
      applyTo,
      communication,
      applied
    });

    const savedJobVacancy = await newJobVacancy.save();

    return res.status(201).json({
      success: true,
      message: "Job vacancy created successfully",
      data: savedJobVacancy,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get all job vacancies

const getAllJobVacancies = async (req, res) => {
  try {
    const jobVacancies = await jobVacancyModel.find();
    if (!jobVacancies || jobVacancies.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No job vacancies found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job vacancies retrieved successfully",
      data: jobVacancies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Errror",
      error: error.message,
    });
  }
};

// get job vacancies by id

const getJobVacancyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    const jobVacancy = await jobVacancyModel.findById(id);

    if (!jobVacancy) {
      return res.status(404).json({
        success: false,
        message: "Job vacancy with the given ID was not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job vacancy retrieved successfully",
      data: jobVacancy,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//update job vacancy data

const updateJobVacancyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    const {
      positionName,
      positionType,
      location,
      companyType,
      salary ,
      startDate,
      endDate,
      annualLeave,
      publicHoliday ,
      responsibilities ,
      qualifications ,
      name,
      email,
      noOfPosition,
      reportingTo,
      workingDaysAndHours ,
      note,
      applyTo,
      communication,
      vacancyAnnouncement,
      experience,
      employer,
      applied 
    } = req.body;

    console.log(typeof salary)

    let parsedSalary = null;
    
    if (typeof salary === 'string') {
      parsedSalary = JSON.parse(salary); 
    }
    
    console.log(parsedSalary);
    console.log(typeof parsedSalary);
    
    // const expectedFields = [
    //   "positionName",
    //   "positionType",
    //   "location",
    //   "companyType",
    //   "salary",
    //   "startDate",
    //   "endDate",
    //   "annualLeave",
    //   "publicHoliday",
    //   "responsibilities",
    //   "qualifications",
    //   "name",
    //   "email",
    //   "noOfPosition",
    //   "reportingTo",
    //   "workingDaysAndHours",
    //   "note",
    //   "applyTo",
    //   "communication",
    //   "vacancyAnnouncement",
    //   "experience",
    //   "employer",
    //   "applied"
    // ];

    // const providedFields = Object.keys(req.body);
    // const invalidFields = providedFields.filter(
    //   (field) => !expectedFields.includes(field)
    // );

    // if (invalidFields.length > 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid fields provided",
    //     invalidFields: invalidFields,
    //   });
    // }


    // if (isNaN(samaxPay) || isNaN(minPay)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Pay values must be valid numbers",
    //   });
    // }

    // if (salary.maxPay < salary.minPay) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Max pay must be greater than or equal to min pay",
    //   });
    // }

    const updatedJobVacancy = await jobVacancyModel.findById(id);
    if (!updatedJobVacancy) {
      return res.status(404).json({
        success: false,
        message: "Job vacancy with the given ID was not found",
      });
    }

    let jobProfileImage = null;
    if (req.file) {
      const file = req.file;
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message:
            "Job profile image must be an image file (JPEG, PNG, or GIF)",
        });
      }

      jobProfileImage = file.filename;
    }

    if(salary){
      updatedJobVacancy.salary.maxPay = salary.maxPay ||   updatedJobVacancy.salary.maxPay ,
      updatedJobVacancy.salary.minPay = salary.minPay ||   updatedJobVacancy.salary.minPay 
    }

    updatedJobVacancy.positionName =
      positionName || updatedJobVacancy.positionName;
    updatedJobVacancy.companyType =
      companyType || updatedJobVacancy.companyType;
    updatedJobVacancy.location = location || updatedJobVacancy.location;
    updatedJobVacancy.jobProfileImage =
      jobProfileImage || updatedJobVacancy.jobProfileImage;
    updatedJobVacancy.startDate = startDate || updatedJobVacancy.startDate;
    updatedJobVacancy.endDate = endDate || updatedJobVacancy.endDate;
    updatedJobVacancy.positionType =
      positionType || updatedJobVacancy.positionType;
    updatedJobVacancy.annualLeave =
      annualLeave || updatedJobVacancy.annualLeave;
    updatedJobVacancy.publicHoliday =
      publicHoliday || updatedJobVacancy.publicHoliday;
    updatedJobVacancy.responsibilities =
      responsibilities || updatedJobVacancy.responsibilities;
    updatedJobVacancy.qualifications =
      qualifications || updatedJobVacancy.qualifications;
    updatedJobVacancy.workingDaysAndHours =
      workingDaysAndHours || updatedJobVacancy.workingDaysAndHours;
    updatedJobVacancy.name = name || updatedJobVacancy.name;
    updatedJobVacancy.email = email || updatedJobVacancy.email;
    updatedJobVacancy.noOfPosition =
      noOfPosition || updatedJobVacancy.noOfPosition;
    updatedJobVacancy.reportingTo =
      reportingTo || updatedJobVacancy.reportingTo;
    updatedJobVacancy.note = note || updatedJobVacancy.note;
    updatedJobVacancy.applyTo = applyTo || updatedJobVacancy.applyTo;
    updatedJobVacancy.communication =
      communication || updatedJobVacancy.communication;
    updatedJobVacancy.vacancyAnnouncement =
      vacancyAnnouncement || updatedJobVacancy.vacancyAnnouncement;
    updatedJobVacancy.experience = experience || updatedJobVacancy.experience;
    updatedJobVacancy.employer = employer || updatedJobVacancy.employer;
    updatedJobVacancy.applied = applied || updatedJobVacancy.applied;

    // if (Array.isArray(qualifications)) {
    //   updatedJobVacancy.qualifications = [
    //     ...new Set([...updatedJobVacancy.qualifications, ...qualifications]),
    //   ];
    // }

    // if (Array.isArray(workingDaysAndHours)) {
    //   updatedJobVacancy.workingDaysAndHours = [
    //     ...new Set([
    //       ...updatedJobVacancy.workingDaysAndHours,
    //       ...workingDaysAndHours,
    //     ]),
    //   ];
    // }

    await updatedJobVacancy.save();

    return res.status(200).json({
      success: true,
      message: "Job vacancy data updated successfully",
      data: updatedJobVacancy,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//delete job vacancy data

const deleteJobVacancyData = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedData = await jobVacancyModel.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(400).json({
        success: false,
        message: "Job vacancy with the given ID was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data deleted",
      response: deletedData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// create a new training courses data

const addTrainingCourse = async (req, res) => {
  try {
    const {
      trainingName,
      type,
      location,
      trainingStartDate,
      duration,
      trainingLevel,
      trainingPrice,
      certificateStandard,
      courseContent,
      courseOverview,
      benefits,
      trainingLanguage,
      whoShouldAttend,
      paymentMethod,
    } = req.body;

    const { clientId } = req.params;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    if (!trainingName) {
      return res.status(400).json({
        success: false,
        message: "Training name is required",
      });
    }
    if (!whoShouldAttend) {
      return res.status(400).json({
        success: false,
        message: " who should attend is required",
      });
    }

    if (!type || !["Online", "Classroom"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing 'type'. Must be 'Online' or 'Classroom'.",
      });
    }

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Location is required",
      });
    }

    if (!trainingStartDate) {
      return res.status(400).json({
        success: false,
        message: "Training start date is required",
      });
    }

    if (!duration) {
      return res.status(400).json({
        success: false,
        message: "Duration is required",
      });
    }

    if (
      !trainingLevel ||
      !["Beginner", "Intermediate", "Advanced"].includes(trainingLevel)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing trainingLevel",
      });
    }

    if (isNaN(trainingPrice) || trainingPrice < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or missing 'trainingPrice'. Must be a non-negative number.",
      });
    }

    let image = "";
    if (req.file) {
      const file = req.file;
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Image must be an image file (JPEG, PNG, or GIF)",
        });
      }

      image = file.filename;
    } else {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const existingData = await trainingCourseModel.findOne({
      trainingName,
      clientId,
      trainingStartDate,
    });

    if (existingData) {
      return res.status(400).json({
        success: false,
        message:
          "A training course with the same name, start date, and client already exists.",
      });
    }

    const newTraining = new trainingCourseModel({
      clientId,
      trainingName,
      type,
      location,
      trainingStartDate,
      duration,
      trainingLevel,
      trainingPrice,
      image,
      certificateStandard,
      courseContent,
      courseOverview,
      benefits,
      trainingLanguage,
      paymentMethod,
      whoShouldAttend,
      registered
    });

    await newTraining.save();

    return res.status(201).json({
      success: true,
      message: "Training course added successfully",
      data: newTraining,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//get all trainig course data

const getAllTrainingCourses = async (req, res) => {
  try {
    const allTrainingData = await trainingCourseModel.find();

    if (!allTrainingData || allTrainingData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No training courses found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "training course data retrieve successfully",
      data: allTrainingData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get single training course by id

const getSingleTrainingCourseById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const trainingData = await trainingCourseModel.findById(id);
    if (!trainingData) {
      return res.status(400).json({
        success: false,
        message: `Training course with the given ID was not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data retrieve successfully",
      data: trainingData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update training course data

const updateTrainingCourseData = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    const {
      trainingName,
      type,
      location,
      duration,
      trainingStartDate,
      trainingLevel,
      trainingPrice,
      certificateStandard,
      courseContent = [],
      courseOverview,
      benefits = [],
      trainingLanguage,
      paymentMethod,
      whoShouldAttend,
      registered
    } = req.body;

    const expectedFields = [
      "trainingName",
      "type",
      "location",
      "duration",
      "trainingStartDate",
      "trainingLevel",
      "trainingPrice",
      "certificateStandard",
      "courseContent",
      "courseOverview",
      "benefits",
      "trainingLanguage",
      "paymentMethod",
      "whoShouldAttend",
    ];

    const providedFields = Object.keys(req.body);
    const invalidFields = providedFields.filter(
      (field) => !expectedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid fields provided",
        invalidFields: invalidFields,
      });
    }

    let image = null;
    if (req.file) {
      const file = req.file;
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Image must be an image file (JPEG,JPG, PNG, or GIF)",
        });
      }

      image = file.filename;
    }

    const trainingData = await trainingCourseModel.findById(id);

    if (!trainingData) {
      return res.status(404).json({
        success: false,
        message: "Training course with the given ID was not found",
      });
    }

    trainingData.trainingName = trainingName || trainingData.trainingName;
    trainingData.type = type || trainingData.type;
    trainingData.location = location || trainingData.location;
    trainingData.duration = duration || trainingData.duration;
    trainingData.trainingStartDate = trainingStartDate
      ? new Date(trainingStartDate)
      : trainingData.trainingStartDate;
    trainingData.trainingLevel = trainingLevel || trainingData.trainingLevel;
    trainingData.trainingPrice = trainingPrice || trainingData.trainingPrice;
    trainingData.image = image || trainingData.image;

    trainingData.certificateStandard =
      certificateStandard || trainingData.certificateStandard;
    trainingData.courseContent = courseContent || trainingData.courseContent;
    trainingData.benefits = benefits || trainingData.benefits;
    trainingData.registered = registered || trainingData.registered;

    // trainingData.courseContent = Array.isArray(courseContent)
    //   ? [...new Set([...trainingData.courseContent, ...courseContent])]
    //   : trainingData.courseContent;

    // trainingData.benefits = Array.isArray(benefits)
    //   ? [...new Set([...trainingData.benefits, ...benefits])]
    //   : trainingData.benefits;

    trainingData.courseOverview = courseOverview || trainingData.courseOverview;
    trainingData.trainingLanguage =
      trainingLanguage || trainingData.trainingLanguage;
    trainingData.paymentMethod = paymentMethod || trainingData.paymentMethod;
    trainingData.whoShouldAttend =
      whoShouldAttend || trainingData.whoShouldAttend;

    await trainingData.save();

    return res.status(200).json({
      success: true,
      message: "Training course data updated successfully",
      data: trainingData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// delete training course data

const deleteTrainingCourseData = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const deletedData = await trainingCourseModel.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(400).json({
        success: false,
        message: `Training course with the given ID was not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data deleted successfully",
      data: deletedData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// create a new hr article

const createHrArticle = async (req, res) => {
  try {
    const {
      title,
      author,
      publicationDate,
      content,
      articleCategory,
      summary,
      majorPoints,
    } = req.body;

    const clientId = req.params.clientId;
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    const existingData = await hrArticleModel.findOne({
      clientId,
      title,
      author,
    });
    if (existingData) {
      return res.status(400).json({
        success: false,
        message: "Data already existed",
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!author) {
      return res.status(400).json({
        success: false,
        message: "Author is required",
      });
    }

    if (!publicationDate) {
      return res.status(400).json({
        success: false,
        message: "Publication date is required",
      });
    }

    if (!majorPoints) {
      return res.status(400).json({
        success: false,
        message: "major points is required",
      });
    }

    if (req.file) {
      const file = req.file;
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Article image must be an image file (JPEG, PNG, or GIF)",
        });
      }

      articleImage = file.filename;
    } else {
      return res.status(400).json({
        success: false,
        message: "article image is required",
      });
    }

    const hrArticleData = new hrArticleModel({
      clientId,
      title,
      author,
      publicationDate,
      content,
      articleCategory,
      summary,
      articleImage,
      majorPoints,
    });

    await hrArticleData.save();

    return res.status(200).json({
      success: true,
      message: "New HR article data is added",
      data: hrArticleData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get all hr article data

const getAllHrAticles = async (req, res) => {
  try {
    const allHrArticleData = await hrArticleModel.find();
    if (!allHrArticleData || allHrArticleData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No hr article found",
      });
    }

    return res.status(200).json({
      success: false,
      message: "All hr article data retrieved",
      data: allHrArticleData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get hr article data by id

const getHrArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const hrArticleData = await hrArticleModel.findById(id);
    if (!hrArticleData) {
      return res.status(400).json({
        success: false,
        message: "no hr article data found with this id",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data retrieve successfully",
      data: hrArticleData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update hr article data

const updateHrArticleDataById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    const {
      title,
      author,
      publicationDate,
      content,
      articleCategory,
      summary,
      majorPoints,
    } = req.body;

    if (req.file) {
      const file = req.file;
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Article image must be an image file (JPEG, PNG, or GIF)",
        });
      }
      articleImage = file.filename;
    }

    const hrArticleData = await hrArticleModel.findById(id);

    if (!hrArticleData) {
      return res.status(404).json({
        success: false,
        message: "HR article with the given ID was not found",
      });
    }

    hrArticleData.title = title || hrArticleData.title;
    hrArticleData.author = author || hrArticleData.author;
    hrArticleData.publicationDate = publicationDate
      ? new Date(publicationDate)
      : hrArticleData.publicationDate;
    hrArticleData.content = content || hrArticleData.content;
    hrArticleData.articleCategory =
      articleCategory || hrArticleData.articleCategory;
    hrArticleData.summary = summary || hrArticleData.summary;
    hrArticleData.majorPoints = majorPoints || hrArticleData.majorPoints;

    // hrArticleData.majorPoints = Array.isArray(majorPoints)
    //   ? [...new Set([...hrArticleData.majorPoints, ...majorPoints])]
    //   : hrArticleData.majorPoints;
    hrArticleData.articleImage = articleImage || hrArticleData.articleImage;

    await hrArticleData.save();

    return res.status(200).json({
      success: true,
      message: "HR article updated successfully",
      data: hrArticleData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// delete hr article data

const deleteHrArticleDataById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const deletedData = await hrArticleModel.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(400).json({
        success: false,
        message: `Data not found with this id : ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// create latest activity

const createLatestActivity = async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "client id is required",
      });
    }

    const {
      activityName,
      typeOfActivity,
      dateOfActivity,
      location,
      content,
      summary,
      majorPoints,
    } = req.body;

    if (!activityName) {
      return res.status(400).json({
        success: false,
        message: "Activity name is required",
      });
    }
    if (!typeOfActivity) {
      return res.status(400).json({
        success: false,
        message: "Type of activity is required",
      });
    }
    if (!dateOfActivity) {
      return res.status(400).json({
        success: false,
        message: "Date of activity is required",
      });
    }
    if (!location) {
      return res.status(400).json({
        success: false,
        message: "location is required",
      });
    }
    if (!content) {
      return res.status(400).json({
        success: false,
        message: "content is required",
      });
    }
    if (!summary) {
      return res.status(400).json({
        success: false,
        message: "summary is required",
      });
    }
    if (!majorPoints) {
      return res.status(400).json({
        success: false,
        message: "major points is required",
      });
    }

    let activityImage = null;
    if (req.file) {
      const file = req.file;
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "activity image must be an image file (JPEG, PNG, or GIF)",
        });
      }

      const existingData = await activityModel.findOne({
        clientId,
        activityName,
        dateOfActivity,
      });
      if (existingData) {
        return res.status(400).json({
          success: false,
          message: "Data already existed",
        });
      }

      activityImage = file.filename;
    } else {
      return res.status(400).json({
        success: false,
        message: "activity image is required",
      });
    }

    const newActivity = new activityModel({
      clientId,
      activityName,
      typeOfActivity,
      dateOfActivity,
      location,
      content,
      summary,
      majorPoints,
      activityImage,
    });

    await newActivity.save();

    return res.status(200).json({
      success: true,
      message: "Activity created successfully",
      data: newActivity,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get all latest activity

const getAllLatestActivities = async (req, res) => {
  try {
    const activities = await activityModel.find();
    if (!activities || activities.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No activities found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Activities retrieved successfully",
      data: activities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get latest activity data by id

const getLatestActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    const activity = await activityModel.findById(id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Activity retrieved successfully",
      data: activity,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update latest activity data

const updateLatestActivityDataById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }
    const {
      activityName,
      typeOfActivity,
      dateOfActivity,
      location,
      content,
      summary,
      majorPoints,
    } = req.body;

    const activity = await activityModel.findById(id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    let activityImage = null;

    if (req.file) {
      const file = req.file;
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Article image must be an image file (JPEG, PNG, or GIF)",
        });
      }
      activityImage = file.filename;
    }
    activity.activityName = activityName || activity.activityName;
    activity.typeOfActivity = typeOfActivity || activity.typeOfActivity;
    activity.dateOfActivity = dateOfActivity || activity.dateOfActivity;
    activity.location = location || activity.location;
    activity.content = content || activity.content;
    activity.summary = summary || activity.summary;
    activity.majorPoints = majorPoints || activity.majorPoints;
    activity.activityImage = activityImage || activity.activityImage;

    await activity.save();

    return res.status(200).json({
      success: true,
      message: "Activity updated successfully",
      data: activity,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// delete latest activity data

const deleteLatestActivityDataById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    const deletedActivity = await activityModel.findByIdAndDelete(id);
    if (!deletedActivity) {
      return res.status(404).json({
        success: false,
        message: `Activity not found with ID: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Activity deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// create client data

const createClient = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phoneNo,
      companyName,
      street,
      city,
      state,
      zipCode,
      totalEmployees,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "password is required",
      });
    }
    if (!phoneNo) {
      return res.status(400).json({
        success: false,
        message: "phone no is required",
      });
    }
    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: "company name is required",
      });
    }
    if (!street) {
      return res.status(400).json({
        success: false,
        message: "street is required",
      });
    }
    if (!city) {
      return res.status(400).json({
        success: false,
        message: "city is required",
      });
    }
    if (!state) {
      return res.status(400).json({
        success: false,
        message: "state is required",
      });
    }
    if (!zipCode) {
      return res.status(400).json({
        success: false,
        message: "zip Code is required",
      });
    }
    if (!totalEmployees) {
      return res.status(400).json({
        success: false,
        message: "no. of employees is required",
      });
    }

    let profileImage = "";
    if (req.file) {
      const file = req.file;
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "profile image must be an image file (JPEG, PNG, or GIF)",
        });
      }

      profileImage = file.filename;
    } else {
      return res.status(400).json({
        success: false,
        message: "profile image is required",
      });
    }
    const existingClient = await clientModel.findOne({ email });

    if (existingClient) {
      return res.status(400).json({
        success: false,
        message:
          "A client with this email already exists. Please use a different email.",
      });
    }

    const newClient = new clientModel({
      name,
      email,
      password,
      phoneNo,
      companyName,
      companyAddress: {
        street,
        city,
        state,
        zipCode,
      },
      profileImage,
      totalEmployees,
    });

    const savedClient = await newClient.save();

    return res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: savedClient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get all client data

const getAllClientData = async (req, res) => {
  try {
    const getAllClientData = await clientModel.find();
    if (!getAllClientData || getAllClientData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No client data found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client data retrieved successfully",
      data: getAllClientData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get client data by id

const getClientDataById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "ID parameter is required. Please provide a valid ID in the request URL.",
      });
    }

    const clientData = await clientModel.findById(id);
    if (!clientData) {
      return res.status(404).json({
        success: false,
        message:
          "No client found with the provided ID. Please check the ID and try again.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Client data feteched successfully.",
      data: clientData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update client data by id

const updateClientDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phoneNo,
      companyName,
      street,
      city,
      state,
      zipCode,
      totalEmployees,
    } = req.body;

    const expectedFields = [
      "name",
      "email",
      "phoneNo",
      "companyName",
      "street",
      "city",
      "state",
      "zipCode",
      "totalEmployees",
    ];

    const providedFields = Object.keys(req.body);
    const invalidFields = providedFields.filter(
      (field) => !expectedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid fields provided",
        invalidFields: invalidFields,
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    let profileImage = "";
    if (req.file) {
      const file = req.file;
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "profile image must be an image file (JPEG, PNG, or GIF)",
        });
      }

      profileImage = file.filename;
    } else {
      return res.status(400).json({
        success: false,
        message: "profile image is required",
      });
    }

    const client = await clientModel.findById(id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    client.name = name || client.name;
    client.email = email || client.email;
    client.phoneNo = phoneNo || client.phoneNo;
    client.companyName = companyName || client.companyName;
    client.profileImage = profileImage || client.profileImage;
    client.totalEmployees = totalEmployees || client.totalEmployees;
    client.companyAddress = {
      street: street || client.companyAddress.street,
      city: city || client.companyAddress.city,
      state: state || client.companyAddress.state,
      zipCode: zipCode || client.companyAddress.zipCode,
    };

    await client.save();

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: client,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// delete client data by id

const deleteClientDataById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "ID parameter is required. Please provide a valid ID in the request URL.",
      });
    }

    const deleteData = await clientModel.findByIdAndDelete(id);

    if (!deleteData) {
      return res.status(404).json({
        success: false,
        message:
          "No client found with the provided ID. Please check the ID and try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client deleted successfully.",
      data: deleteData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// client login

const clientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email required",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "password required",
      });
    }

    const client = await clientModel.findOne({ email });

    console.log(client);

    if (!client) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Email",
      });
    }

    if (client.password && client.password.startsWith("$2b$")) {
      const matchPassword = await bcrypt.compare(password, client.password);
      if (!matchPassword) {
        return res.status(400).json({
          success: false,
          message: "Incorrect Password",
        });
      }
    } else {
      const hashedPassword = await bcrypt.hash(client.password, 10);
      console.log(hashedPassword);

      client.password = hashedPassword;

      const matchPassword = bcrypt.compare(password, client.password);

      await client.save();
      if (!matchPassword) {
        return res.status(400).json({
          success: false,
          message: "Incorrect Password",
        });
      }
    }
    return res.status(200).json({
      success: true,
      message: "client login Successfully",
      data: client,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// change password

const changePassword = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid user ID.",
      });
    }
    const { oldPassword, newPassword, confirmPassword } = req.body;
    console.log(oldPassword);

    if (!oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide old password",
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide new password",
      });
    }

    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide confirm password",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password can't be same",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "The passwords do not match. Please ensure your new passwords match.",
      });
    }

    const client = await clientModel.findById(id);

    console.log(client.password);

    if (!client) {
      return res.status(400).json({
        success: false,
        message: "client Not Found",
      });
    }

    const matchPassword = await bcrypt.compare(oldPassword, client.password);
    console.log(matchPassword);

    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: "Your old Password is incorrect",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    client.password = hashPassword;

    await client.save();

    res.status(200).json({
      success: true,
      message: "Password Changed",
      data: client,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Forget Password
// generate otp

const generateOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const client = await clientModel.findOne({ email });
    if (!client) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const length = Math.floor(Math.random() * 3) + 4;
    let otp = "";

    otp += Math.floor(Math.random() * 9) + 1;
    for (let i = 1; i < length; i++) {
      otp += Math.floor(Math.random() * 10);
    }

    const otpData = {
      otp: otp,
    };

    const existingOtp = await OtpClientModel.findOne({ clientId: client._id });

    if (existingOtp) {
      await OtpClientModel.updateOne({ clientId: client._id }, otpData);
    } else {
      otpData.clientId = client._id;
      await OtpClientModel.create(otpData);
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f4f8;">
    <div style="max-width: 600px; margin: 20px auto; padding: 30px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); border-top: 5px solid #007bff;">
        <h2 style="font-size: 26px; color: #333; margin-bottom: 20px; text-align: center;">Your OTP Code</h2>
        <p style="font-size: 18px; color: #444; margin-bottom: 20px; text-align: center;">
            <strong>Hello ${client.name} </strong>
        </p>
        <p style="font-size: 18px; color: #444; margin-bottom: 20px; text-align: center;">
            Your one-time password (OTP) is:
        </p>
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="font-size: 36px; color: #ffffff; background-color: #007bff; margin: 0; padding: 15px 0; border-radius: 5px; display: inline-block;">
                <strong>${otp}</strong>
            </h1>
        </div>
        <p style="font-size: 18px; color: #444; margin-bottom: 20px; text-align: center;">
            Please use this OTP to complete your verification. The OTP is valid for <strong>10 minutes</strong>.
        </p>
        <p style="font-size: 18px; color: #444; margin-bottom: 20px; text-align: center;">
            If you did not request this code, please ignore this email.
        </p>
        <p style="font-size: 18px; color: #444; text-align: center;">
        </p>
    </div>
</body>
</html>`;

    await admin_otp_email(email, "Forget password otp", htmlContent);

    return res.status(200).json({
      success: true,
      message: "You should receive an OTP",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// verify otp

const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Otp required",
      });
    }

    const otpData = await OtpClientModel.findOne({ otp });
    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "The OTP you entered is incorrect.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your OTP has been verified successfully.",
      clientId: otpData.clientId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// reset password

const resetPassword = async (req, res) => {
  try {
    const { clientId } = req.params;
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "id required",
      });
    }

    const { newPassword, confirmNewPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Enter new password",
      });
    }

    if (!confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Enter confirm new password",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message:
          "The passwords do not match. Please ensure your new passwords match.",
      });
    }

    const client = await clientModel.findOne({ _id: clientId });
    if (!client) {
      return res.status(400).json({
        success: false,
        message: "client not found",
      });
    }

    const matchPassword = await bcrypt.compare(newPassword, client.password);

    if (matchPassword) {
      return res.status(400).json({
        success: false,
        message: "old password and new password can not be same",
      });
    }

    client.password = await bcrypt.hash(newPassword, 10);
    await client.save();
    await OtpClientModel.deleteOne({ clientId });

    return res.status(200).json({
      success: true,
      message: "Reset password successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//training Registration

const createRegistration = async (req, res) => {
  try {

    const userId =  req.params.userId
    if(!userId){
      return res.status(400).json({
        success : false,
        message : "Id is required"
      })
    }

    const userData  = await UserModel.findOne({_id:userId})
    if(!userData){
      return res.status(400).json({
        success : false,
        message : "user data not found with this id"
      })
    }
    const { trainingId } = req.params;
    if(!trainingId){
      return res.status(400).json({
        success  : false,
        message : "training id is required"
      })
    }

    const trainingData = await Registration.findById({_id:trininigId})
    if(!trainingData){
      return res.status(400).json({
        success : false,
        message  : "Trainging data not found with this id"
      })
    }

    const {
      participantName,
      phone,
      email,
      city,
      communicationLanguage,
      paymentType,
      cvUrl,
      linkedinProfileUrl,
      hearAbout,
    } = req.body;

    if (!participantName) {
      return res.status(400).json({
        success: false,
        message: "Participant name is required",
      });
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    if (!communicationLanguage) {
      return res.status(400).json({
        success: false,
        message: "Communication language is required",
      });
    }

    if (!paymentType) {
      return res.status(400).json({
        success: false,
        message: "Payment type is required",
      });
    }

    if (!hearAbout) {
      return res.status(400).json({
        success: false,
        message: "How did you hear about this training is required",
      });
    }

    const validPaymentTypes = ["Cash", "FIB", "Bank Transfer", "Other"];
    if (!validPaymentTypes.includes(paymentType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment type",
      });
    }

    if (!trainingId) {
      return res.status(400).json({
        success: false,
        message: "Training ID is required",
      });
    }

    if (cvUrl && !isValidUrl(cvUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid CV URL",
      });
    }

    if (linkedinProfileUrl && !isValidUrl(linkedinProfileUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid LinkedIn profile URL",
      });
    }

    function isValidUrl(url) {
      try {
        new URL(url);
        return true;
      } catch (error) {
        return false;
      }
    }

    let profileImage = null;
    if (req.file) {
      profileImage = req.file.filename;
    }

    const existingData = await Registration.findOne({ trainingId, email });
    if (existingData) {
      return res.status(400).json({
        success: false,
        message: "Data already existed",
      });
    }

    const newRegistration = new Registration({
      participantName,
      phone,
      email,
      city,
      communicationLanguage,
      paymentType,
      cvUrl,
      linkedinProfileUrl,
      trainingId,
      hearAbout,
      profileImage,
    });

    const savedRegistration = await newRegistration.save();

    return res.status(201).json({
      success: true,
      message: "Training Registration created successfully",
      data: savedRegistration,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get all training registration

const getAllTrainingRegistration = async (req, res) => {
  try {
    const getAllTrainingRegistration = await Registration.find();
    if (
      !getAllTrainingRegistration &&
      getAllTrainingRegistration.length() === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "No registration found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Training registration data retrieved successfully",
      data: getAllTrainingRegistration,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get training Registration by id

const getTrainingRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "ID parameter is required. Please provide a valid ID in the request URL.",
      });
    }

    const clientData = await Registration.findById(id);
    if (!clientData) {
      return res.status(404).json({
        success: false,
        message:
          "No training registration found with the provided ID. Please check the ID and try again.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "training registration data feteched successfully.",
      data: clientData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update training Registration by id

const updateTrainingRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      participantName,
      phone,
      email,
      city,
      communicationLanguage,
      paymentType,
      cvUrl,
      linkedinProfileUrl,
      hearAbout,
      trainingId,
    } = req.body;

    const expectedFields = [
      "participantName",
      "phone",
      "email",
      "profileImage",
      "city",
      "communicationLanguage",
      "paymentType",
      "cvUrl",
      "linkedinProfileUrl",
      "hearAbout",
      "trainingId",
    ];

    const providedFields = Object.keys(req.body);
    const invalidFields = providedFields.filter(
      (field) => !expectedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid fields provided",
        invalidFields: invalidFields,
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    let profileImage = "";
    if (req.file) {
      profileImage = req.file.filename;
    }

    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    registration.participantName =
      participantName || registration.participantName;
    registration.phone = phone || registration.phone;
    registration.email = email || registration.email;
    registration.profileImage = profileImage || registration.profileImage;
    registration.city = city || registration.city;
    registration.communicationLanguage =
      communicationLanguage || registration.communicationLanguage;
    registration.paymentType = paymentType || registration.paymentType;
    registration.cvUrl = cvUrl || registration.cvUrl;
    registration.linkedinProfileUrl =
      linkedinProfileUrl || registration.linkedinProfileUrl;
    registration.hearAbout = hearAbout || registration.hearAbout;
    registration.trainingId = trainingId || registration.trainingId;

    await registration.save();

    return res.status(200).json({
      success: true,
      message: "Registration updated successfully",
      data: registration,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// delete training Registration by Id

const deleteTrainingRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "ID parameter is required. Please provide a valid ID in the request URL.",
      });
    }

    const deleteData = await Registration.findByIdAndDelete(id);

    if (!deleteData) {
      return res.status(404).json({
        success: false,
        message:
          "No registration found with the provided ID. Please check the ID and try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Training registration data deleted successfully.",
      data: deleteData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// create training request

const createTrainingRequest = async (req, res) => {
  try {

    const userId =  req.params.userId
    if(!userId){
      return res.status(400).json({
        success : false,
        message : "Id is required"
      })
    }

    const userData  = await UserModel.findOne({_id:userId})
    if(!userData){
      return res.status(400).json({
        success : false,
        message : "user data not found with this id"
      })
    }
    const { trainingId } = req.params;
    if (!trainingId) {
      return res.status(400).json({
        success: false,
        message: "training id is required",
      });
    }

    const trainingData = await trainingCourseModel.findOne({_id:trainingId})
    if(!trainingData){
      return res.status(400).json({
        success: false,
        message : "Training Data not found with this id"
      })
    }

    const {
      participantName,
      phone,
      email,
      city,
      trainingType,
      trainingDays,
      trainingTime,
      participantType,
      numberOfParticipants,
      trainingLocation,
      description,
    } = req.body;

    if (!participantName || !phone || !email || !city) {
      return res.status(400).json({
        success: false,
        message:
          "Participant name, phone, email, city, and trainings name are required",
      });
    }

    if (trainingType === "In Class" && !trainingLocation) {
      return res.status(400).json({
        success: false,
        message: "Training location is required for in-class training",
      });
    }

    if (trainingType === "Online" && (!trainingDays || !trainingTime)) {
      return res.status(400).json({
        success: false,
        message: "Training days and time are required for online training",
      });
    }

    const existingData = await TrainingRequest.findOne({ trainingId, email });

    if (existingData) {
      return res.status(400).json({
        success: false,
        message: "Data already existed",
      });
    }

    const newRequest = new TrainingRequest({
      participantName,
      phone,
      email,
      city,
      trainingType,
      trainingDays,
      trainingTime,
      userId,
      // trainingName:trainingData._id,
      participantType,
      numberOfParticipants,
      trainingLocation,
      description,
      trainingId,
    });

    await newRequest.save();

    return res.status(201).json({
      success: true,
      message: "Training request created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get all trainig customized request

const getAllTrainingRequest = async (req, res) => {
  try {
    const getAllTrainingRequestData = await TrainingRequest.find();
    if (
      !getAllTrainingRequestData &&
      getAllTrainingRequestData.length() === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "No training request data found",
      });
    }
    return res.status(200).json({
      success: false,
      message: "All training request data retrieved successfully",
      data: getAllTrainingRequestData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get training customized request by Id

const getTrainingRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "ID parameter is required. Please provide a valid ID in the request URL.",
      });
    }

    const trainingRequest = await TrainingRequest.findById(id);
    if (!trainingRequest) {
      return res.status(404).json({
        success: false,
        message:
          "No training request found with the provided ID. Please check the ID and try again.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "training request data feteched successfully.",
      data: trainingRequest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update training request by Id

const updateTrainingRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      participantName,
      phone,
      email,
      city,
      trainingType,
      trainingDays,
      trainingTime,
      trainingName,
      participantType,
      numberOfParticipants,
      trainingLocation,
      description,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    const request = await TrainingRequest.findOne({ _id: id });
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "No training request found with the provided ID",
      });
    }

    request.participantName = participantName || request.participantName;
    request.phone = phone || request.phone;
    request.email = email || request.email;
    request.city = city || request.city;
    request.trainingType = trainingType || request.trainingType;
    request.trainingDays = trainingDays || request.trainingDays;
    request.trainingTime = trainingTime || request.trainingTime;
    request.trainingName = trainingName || request.trainingName;
    request.participantType = participantType || request.participantType;
    request.numberOfParticipants =
      numberOfParticipants || request.numberOfParticipants;
    request.trainingLocation = trainingLocation || request.trainingLocation;
    request.description = description || request.description;

    await request.save();

    return res.status(200).json({
      success: true,
      message: "Training request updated successfully",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// delete training request by id

const deleteTrainingRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "ID parameter is required. Please provide a valid ID in the request URL.",
      });
    }

    const deleteData = await TrainingRequest.findByIdAndDelete(id);

    if (!deleteData) {
      return res.status(404).json({
        success: false,
        message:
          "No training request found with the provided ID. Please check the ID and try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Training request data deleted successfully.",
      data: deleteData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Create a new trainer registration

const createTrainerRegistration = async (req, res) => {
  try {

    const userId =  req.params.userId
    if(!userId){
      return res.status(400).json({
        success : false,
        message : "Id is required"
      })
    }

    const userData  = await UserModel.findOne({_id:userId})
    if(!userData){
      return res.status(400).json({
        success : false,
        message : "user data not found with this id"
      })
    }

    const {
      trainerName,
      phone,
      email,
      city,
      trainingType,
      experience,
      availableDays,
      trainingTopics,
      availableTimesDetail,
    } = req.body;

    if (
      !trainerName ||
      !phone ||
      !email ||
      !city ||
      !experience ||
      !trainingType ||
      !availableDays ||
      !availableTimesDetail ||
      !trainingTopics
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // let profileImage = "";
    // if (req.files["profileImage"] && req.files["profileImage"][0]) {
    //   const file = req.files["profileImage"][0];
    //   const allowedTypes = [
    //     "image/jpeg",
    //     "image/jpg",
    //     "image/png",
    //     "image/gif",
    //   ];

    //   if (!allowedTypes.includes(file.mimetype)) {
    //     return res.status(400).json({
    //       success: false,
    //       message: "profile image must be an image file (JPEG, PNG, or GIF)",
    //     });
    //   }

    //   profileImage = file.filename;
    // } else {
    //   return res.status(400).json({
    //     success: false,
    //     message: "profile image is required",
    //   });
    // }

    let cv = "";
    if (req.files["cv"] && req.files["cv"][0]) {
      const file = req.files["cv"][0];
      if (file.mimetype !== "application/pdf") {
        return res.status(400).json({
          success: false,
          message: "CV must be a PDF file",
        });
      }
      cv = file.filename;
    } else {
      return res.status(400).json({
        success: false,
        message: "CV is required",
      });
    }

    // Handle certificates
    let certificates = [];
    if (req.files["certificates"]) {
      certificates = req.files["certificates"].map((file) => {
        if (file.mimetype !== "application/pdf") {
          return res.status(400).json({
            success: false,
            message: "Certificates must be PDF files",
          });
        }
        return file.filename;
      });
    }

    const existingData = await TrainerRegitrationModel.findOne({ email });
    if (existingData) {
      return res.status(400).json({
        success: false,
        message: "Data already existed",
      });
    }

    const newTrainer = new TrainerRegitrationModel({
      userId,
      trainerName,
      phone,
      email,
      city,
      trainingType,
      experience,
      availableDays,
      cv,
      certificates,
      trainingTopics,
      // profileImage,
      availableTimesDetail,
    });

    const savedTrainer = await newTrainer.save();

    return res.status(201).json({
      success: true,
      message: "Trainer created successfully",
      data: savedTrainer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get all trainer registrations

const getAllTrainerRegistrations = async (req, res) => {
  try {
    const registrations = await TrainerRegitrationModel.find();
    if (!registrations || registrations.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No registrations found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trainer registrations retrieved successfully",
      data: registrations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get trainer registration by ID

const getTrainerRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    const trainer = await TrainerRegitrationModel.findById(id);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer registration not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trainer registration data fetched successfully",
      data: trainer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Update trainer registration by ID

const updateTrainerRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      trainerName,
      phone,
      email,
      city,
      trainingType,
      availableDays,
      trainingTopics,
      availableTimesDetail,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    const trainer = await TrainerRegitrationModel.findById(id);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "No trainer found with the provided ID",
      });
    }

    if (email && email !== trainer.email) {
      const existingTrainer = await TrainerRegitrationModel.findOne({ email });
      if (existingTrainer) {
        return res.status(400).json({
          success: false,
          message: "Trainer with this email already exists",
        });
      }
    }

    console.log(req.files);

    let profileImage = trainer.profileImage;
    if (req.files["profileImage"] && req.files["profileImage"][0]) {
      const file = req.files["profileImage"][0];
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Profile image must be an image file (JPEG, PNG, or GIF)",
        });
      }

      profileImage = file.filename;
    }

    let cv = trainer.cv;
    if (req.files["cv"] && req.files["cv"][0]) {
      const file = req.files["cv"][0];
      if (file.mimetype !== "application/pdf") {
        return res.status(400).json({
          success: false,
          message: "CV must be a PDF file",
        });
      }
      cv = file.filename;
    }

    let certificates = trainer.certificates;
    if (req.files["certificates"]) {
      certificates = req.files["certificates"].map((file) => {
        if (file.mimetype !== "application/pdf") {
          return res.status(400).json({
            success: false,
            message: "Certificates must be PDF files",
          });
        }
        return file.filename;
      });
    }

    trainer.trainerName = trainerName || trainer.trainerName;
    trainer.phone = phone || trainer.phone;
    trainer.email = email || trainer.email;
    trainer.city = city || trainer.city;
    trainer.trainingType = trainingType || trainer.trainingType;
    trainer.availableDays = availableDays || trainer.availableDays;
    trainer.trainingTopics = trainingTopics || trainer.trainingTopics;
    trainer.availableTimesDetail =
      availableTimesDetail || trainer.availableTimesDetail;
    trainer.profileImage = profileImage;
    trainer.cv = cv;
    trainer.certificates = certificates;

    await trainer.save();

    return res.status(200).json({
      success: true,
      message: "Trainer updated successfully",
      data: trainer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Delete trainer registration by ID

const deleteTrainerRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    const deletedData = await TrainerRegitrationModel.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(404).json({
        success: false,
        message: "Trainer registration not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trainer registration deleted successfully",
      data: deletedData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// create user data

const createUser = async (req, res) => {
  try {
    const { name, email, password, phoneNo } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "password is required",
      });
    }
    if (!phoneNo) {
      return res.status(400).json({
        success: false,
        message: "phone no is required",
      });
    }

    let profileImage = "";
    if (req.file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!allowedTypes.includes(req.file.mimetype))
        return res.status(400).json({
          success: false,
          message: "Only image file is allowed",
        });

      profileImage = req.file.filename;
    } else {
      return res.status(500).json({
        success: false,
        message: "Image file is requried",
      });
    }

    const existingData = await UserModel.findOne({ email });
    if (existingData) {
      return res.status(400).json({
        success: false,
        message: "Data already existed",
      });
    }

    const user = new UserModel({
      name,
      email,
      password,
      profileImage,
      phoneNo,
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User data registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get client data by Id

const getUserDataById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "ID parameter is required. Please provide a valid ID in the request URL.",
      });
    }

    const userData = await UserModel.findById(id);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message:
          "No user found with the provided ID. Please check the ID and try again.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User data feteched successfully.",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update client data by Id

const updateUserDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNo } = req.body;

    const expectedFields = ["name", "email", "phoneNo"];

    const providedFields = Object.keys(req.body);
    const invalidFields = providedFields.filter(
      (field) => !expectedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid fields provided",
        invalidFields: invalidFields,
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    if (req.file) {
      const file = req.file;
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "profile image must be an image file (JPEG, PNG, or GIF)",
        });
      }

      profileImage = file.filename;
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNo = phoneNo || user.phoneNo;
    user.profileImage = profileImage || user.profileImage;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "user data updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// delete client data by Id

const deleteUserDataById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "ID parameter is required. Please provide a valid ID in the request URL.",
      });
    }

    const deleteData = await UserModel.findByIdAndDelete(id);

    if (!deleteData) {
      return res.status(404).json({
        success: false,
        message:
          "No user found with the provided ID. Please check the ID and try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user deleted successfully.",
      data: deleteData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// client login

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email required",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "password required",
      });
    }

    const user = await userModel.findOne({ email });

    console.log(user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Email",
      });
    }

    if (user.password && user.password.startsWith("$2b$")) {
      const matchPassword = await bcrypt.compare(password, user.password);
      if (!matchPassword) {
        return res.status(400).json({
          success: false,
          message: "Incorrect Password",
        });
      }
    } else {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      console.log(hashedPassword);

      user.password = hashedPassword;

      const matchPassword = bcrypt.compare(password, user.password);

      await user.save();
      if (!matchPassword) {
        return res.status(400).json({
          success: false,
          message: "Incorrect Password",
        });
      }
    }
    return res.status(200).json({
      success: true,
      message: "user login Successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// change password

const change_password = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid user ID.",
      });
    }
    const { oldPassword, newPassword, confirmPassword } = req.body;
    console.log(oldPassword);

    if (!oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide old password",
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide new password",
      });
    }

    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide confirm password",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password can't be same",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "The passwords do not match. Please ensure your new passwords match.",
      });
    }

    const user = await userModel.findById(id);

    console.log(user.password);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user Not Found",
      });
    }

    const matchPassword = await bcrypt.compare(oldPassword, user.password);
    console.log(matchPassword);

    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: "Your old Password is incorrect",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Changed",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Forget Password
// generate otp

const generate_otp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const length = Math.floor(Math.random() * 3) + 4;
    let otp = "";

    otp += Math.floor(Math.random() * 9) + 1;
    for (let i = 1; i < length; i++) {
      otp += Math.floor(Math.random() * 10);
    }

    const otpData = {
      otp: otp,
    };

    const existingOtp = await OtpUserModel.findOne({ userId: user._id });

    if (existingOtp) {
      await OtpUserModel.updateOne({ userId: user._id }, otpData);
    } else {
      otpData.userId = user._id;
      await OtpUserModel.create(otpData);
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f4f8;">
    <div style="max-width: 600px; margin: 20px auto; padding: 30px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); border-top: 5px solid #007bff;">
        <h2 style="font-size: 26px; color: #333; margin-bottom: 20px; text-align: center;">Your OTP Code</h2>
        <p style="font-size: 18px; color: #444; margin-bottom: 20px; text-align: center;">
            <strong>Hello ${user.name} </strong>
        </p>
        <p style="font-size: 18px; color: #444; margin-bottom: 20px; text-align: center;">
            Your one-time password (OTP) is:
        </p>
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="font-size: 36px; color: #ffffff; background-color: #007bff; margin: 0; padding: 15px 0; border-radius: 5px; display: inline-block;">
                <strong>${otp}</strong>
            </h1>
        </div>
        <p style="font-size: 18px; color: #444; margin-bottom: 20px; text-align: center;">
            Please use this OTP to complete your verification. The OTP is valid for <strong>10 minutes</strong>.
        </p>
        <p style="font-size: 18px; color: #444; margin-bottom: 20px; text-align: center;">
            If you did not request this code, please ignore this email.
        </p>
        <p style="font-size: 18px; color: #444; text-align: center;">
        </p>
    </div>
</body>
</html>`;

    await admin_otp_email(email, "Forget password otp", htmlContent);

    return res.status(200).json({
      success: true,
      message: "You should receive an OTP",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// verify otp

const verify_otp = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Otp required",
      });
    }

    const otpData = await OtpUserModel.findOne({ otp });
    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "The OTP you entered is incorrect.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your OTP has been verified successfully.",
      clientId: otpData.userId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// reset password

const reset_password = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "id required",
      });
    }

    const { newPassword, confirmNewPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Enter new password",
      });
    }

    if (!confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Enter confirm new password",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message:
          "The passwords do not match. Please ensure your new passwords match.",
      });
    }

    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "client not found",
      });
    }

    const matchPassword = await bcrypt.compare(newPassword, user.password);

    if (matchPassword) {
      return res.status(400).json({
        success: false,
        message: "old password and new password can not be same",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await OtpUserModel.deleteOne({ userId });

    return res.status(200).json({
      success: true,
      message: "Reset password successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// create a contact us

const createContactUs = async (req, res) => {
  try {
    const { clientId } = req.params;
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Id is requried",
      });
    }

    const { name, email, subject, message, phoneNo } = req.body;
    if (!name) {
      return res.status(400).json({
        success: true,
        message: "name is required",
      });
    }
    if (!message) {
      return res.status(400).json({
        success: true,
        message: "message is required",
      });
    }
    if (!subject) {
      return res.status(400).json({
        success: true,
        message: "subject is required",
      });
    }
    if (!email) {
      return res.status(400).json({
        success: true,
        message: "email is required",
      });
    }
    if (!phoneNo) {
      return res.status(400).json({
        success: true,
        message: "phone no is required",
      });
    }

    const existingData = await contactUsModel.findOne({ email });
    if (existingData) {
      return res.status(400).json({
        success: false,
        message: "data already existed",
      });
    }

    const contactUs = new contactUsModel({
      name,
      email,
      phoneNo,
      subject,
      message,
    });

    await contactUs.save();

    return res.status(200).json({
      success: true,
      message: "Contact us added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get all contact us

const getAllContactUs = async (req, res) => {
  try {
    const getAllContactUsData = await contactUsModel.find();
    if (!getAllContactUsData || getAllContactUsData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "contact us dats not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All contact us data fetched",
      data: getAllContactUsData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// create cv submit

const createCvSubmit = async (req, res) => {
  try {

    const userId =  req.params.userId
    if(!userId){
      return res.status(400).json({
        success : false,
        message : "Id is required"
      })
    }

    const userData  = await UserModel.findOne({_id:userId})
    if(!userData){
      return res.status(400).json({
        success : false,
        message : "user data not found with this id"
      })
    }

    const {
      applicantName,
      nationality,
      phoneNo,
      email,
      city,
      address,
      education,
      languageSkill,
    } = req.body;

    if (!applicantName) {
      return res.status(400).json({
        success: false,
        message: "Applicant Name is required",
      });
    }
    if (!nationality) {
      return res.status(400).json({
        success: false,
        message: "Nationality is required",
      });
    }
    if (!phoneNo) {
      return res.status(400).json({
        success: false,
        message: "phone No is required",
      });
    }
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email is required",
      });
    }
    if (!city) {
      return res.status(400).json({
        success: false,
        message: "city is required",
      });
    }
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "address is required",
      });
    }
    if (!education) {
      return res.status(400).json({
        success: false,
        message: "education is required",
      });
    }
    if (!languageSkill) {
      return res.status(400).json({
        success: false,
        message: "language skill is required",
      });
    }

    let cv = "";
    console.log(req.file);

    if (req.file) {
      const file = req.file;
      const allowedTypes = ["application/pdf"];

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "CV must be an pdf file",
        });
      }

      cv = file.filename;
    } else {
      return res.status(400).json({
        success: false,
        message: "CV is required",
      });
    }

    const existingData = await cvSubmitModel.findOne({ email });
    if (existingData) {
      return res.status(400).json({
        success: false,
        message: "Data already existed",
      });
    }

    const cvSubmitData = new cvSubmitModel({
      applicantName,
      nationality,
      phoneNo,
      email,
      userId,
      city,
      address,
      education,
      languageSkill,
      cv,
    });

    await cvSubmitData.save();

    return res.status(200).json({
      success: true,
      message: "Your CV has been submitted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get cv submit

const getCvSubmit = async (req, res) => {
  try {
    const getCvSubmitData = await cvSubmitModel.find();
    if (!getCvSubmitData || getCvSubmitData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No CV submission data found.",
      });
    }

    return res.status(200).json({
      success: false,
      message: "Cv submission data retrieved successfully",
      data: getCvSubmitData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update cv submit

const updateCvSubmitById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }
    const cvSubmitData = await cvSubmitModel.findById(id);

    if (!cvSubmitData) {
      return res.status(400).json({
        success: false,
        message: "No data found with this id",
      });
    }

    const {
      applicantName,
      nationality,
      phoneNo,
      email,
      city,
      address,
      education,
      languageSkill,
    } = req.body;

    cvSubmitData.applicantName = applicantName || cvSubmitData.applicantName;
    cvSubmitData.nationality = nationality || cvSubmitData.nationality;
    cvSubmitData.phoneNo = phoneNo || cvSubmitData.phoneNo;
    cvSubmitData.email = email || cvSubmitData.email;
    cvSubmitData.city = city || cvSubmitData.city;
    cvSubmitData.address = address || cvSubmitData.address;

    if (education) {
      cvSubmitData.education.degree = education.degree || cvSubmitData.degree;
      cvSubmitData.education.branch = education.branch || cvSubmitData.branch;
      cvSubmitData.education.university =
        education.university || cvSubmitData.university;
      cvSubmitData.education.college =
        education.college || cvSubmitData.college;
      cvSubmitData.education.graduationYear =
        education.graduationYear || cvSubmitData.graduationYear;
      cvSubmitData.education.location =
        education.location || cvSubmitData.location;
      cvSubmitData.education.cgpa = education.cgpa || cvSubmitData.cgpa;
    }

    if (languageSkill) {
      languageSkill.forEach((skill) => {
        const existingSkill = cvSubmitData.languageSkill.find(
          (s) => s.name === skill.name
        );

        if (existingSkill) {
          existingSkill.fluencyLevel =
            skill.fluencyLevel || existingSkill.fluencyLevel;
        } else {
          cvSubmitData.languageSkill.push({
            name: skill.name,
            fluencyLevel: skill.fluencyLevel,
          });
        }
      });
    }

    console.log(req.file);
    console.log(req.file.filename);

    if (req.file) {
      let file = req.file;
      const expectedExtension = ["application/pdf"];

      if (!expectedExtension.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Only PDF files are allowed",
        });
      }
      cvSubmitData.cv = file.filename;
    }

    await cvSubmitData.save();

    return res.status(200).json({
      success: false,
      message: "Updated data successfully",
      data: cvSubmitData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// delete cv submit

const deleteCvSubmitById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }
    const cvSubmitData = await cvSubmitModel.findByIdAndDelete(id);
    if (!cvSubmitData) {
      return res.status(400).json({
        success: false,
        message: "No data found with this id",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Data deleted successfully",
      data: cvSubmitData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// create applicant cv data

// const createApplicantCv = async (req, res) => {
//   try {
//     const userId =  req.params.userId
//     if(!userId){
//       return res.status(400).json({
//         success : false,
//         message : "Id is required"
//       })
//     }

//     const userData  = await UserModel.findOne({_id:userId})
//     if(!userData){
//       return res.status(400).json({
//         success : false,
//         message : "user data not found with this id"
//       })
//     }
//     const {
//       applicantName,
//       personalInformation,
//       education,
//       languageSkills,
//       computerSkills,
//       trainingAndWorkshops,
//       professionalMembership,
//       experience,
//       dutiesAndResponsibilities,
//     } = req.body;

//     console.log(req.body)

//     // console.log(education)
//     // console.log(typeof education)
//     // console.log(req.body.educations)
//     // console.log(typeof req.body.educations)
   
    
//     // const educations = JSON.parse(req.body.educations);
//     // console.log(educations)
//     // console.log(typeof educations) 

//     // educations.forEach((value)=>{
//     //   console.log(value.degree)
//     // })

//     if (!applicantName) {

//       return res.status(400).json({
//         success: false,
//         message: "Applicant name is required",
//       });
//     }

//     const existingData = await applicantCvModel.findOne({
//       "personalInformation.email": personalInformation.email,
//     });
//     if (existingData) {
//       return res.status(400).json({
//         success: false,
//         message: "Data already exists",
//       });
//     }

//     // console.log(req.files);

//     const allowedTypes = ["image/jpeg","image/jpg" ,"image/png", "image/gif"];

//     const profileImageFile = req.files["profileImage"];
//     const logoFile = req.files["logo"];

//     if (
//       !profileImageFile ||
//       !allowedTypes.includes(profileImageFile[0].mimetype)
//     ) {
//       return res
//         .status(400)
//         .json({
//           message:
//             "Invalid profile image type. Allowed types are: JPEG,JPG, PNG, GIF.",
//         });
//     }

//     if (!logoFile || !allowedTypes.includes(logoFile[0].mimetype)) {
//       return res
//         .status(400)
//         .json({
//           message:
//             "Invalid logo image type. Allowed types are: JPEG, JPG , PNG, GIF.",
//         });
//     }

//     const profileImage = profileImageFile ? profileImageFile[0].filename : null;
//     const logo = logoFile ? logoFile[0].filename : null;

    

//     const applicantCvData = new applicantCvModel({
//       applicantName,
//       personalInformation: {
//         ...personalInformation,
//         profileImage,
//       },
//       education,
//       languageSkills,
//       computerSkills,
//       trainingAndWorkshops,
//       professionalMembership,
//       experience: experience.map((exp) => ({ ...exp, logo })),
//       dutiesAndResponsibilities,
//     });

//     await applicantCvData.save();

//     return res.status(200).json({
//       success: true,
//       message: "Applicant CV data created successfully",
//       data: applicantCvData,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };


const createApplicantCv = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const userData = await UserModel.findOne({ _id: userId });
    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "User data not found with this id",
      });
    }

    const {
      applicantName,
      personalInformation,
      education,
      languageSkills,
      computerSkills,
      trainingAndWorkshops,
      professionalMembership,
      experience,
      dutiesAndResponsibilities,
    } = req.body;

    if (!applicantName) {
      return res.status(400).json({
        success: false,
        message: "Applicant name is required",
      });
    }

    const existingData = await applicantCvModel.findOne({
      "personalInformation.email": personalInformation.email,
    });
    if (existingData) {
      return res.status(400).json({
        success: false,
        message: "Data already exists",
      });
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    
    console.log("Req : ",req.files)
    const profileImageFile = req.files["profileImage"];
    console.log("pro",profileImageFile)
    const logoFiles = req.files["logo"]; 

    console.log(logoFiles);
    
    if (!profileImageFile || !allowedTypes.includes(profileImageFile[0].mimetype)) {
      return res.status(400).json({
        message: "Invalid profile image type. Allowed types are: JPEG, JPG, PNG, GIF.",
      });
    }

    if (!logoFiles || logoFiles.some(file => !allowedTypes.includes(file.mimetype))) {
      return res.status(400).json({
        message: "Invalid logo image type. Allowed types are: JPEG, JPG, PNG, GIF.",
      });
    }

    const profileImage = profileImageFile[0].filename;
    
    // Map the logo files to their filenames
    const logos = logoFiles.map(file => file.filename);

    console.log("logos :",logos);
    
    console.log("exp",experience)

    const applicantCvData = new applicantCvModel({
      applicantName,
      personalInformation: {
        ...personalInformation,
        profileImage,
      },
      education,
      languageSkills,
      computerSkills,
      trainingAndWorkshops,
      professionalMembership,
      experience: experience.map((exp, index) => ({ ...exp, logo: logos[index] || null } ) ), 
    });
    
    await applicantCvData.save();
    
    console.log("After insertion of image :" , experience)
    return res.status(200).json({
      success: true,
      message: "Applicant CV data created successfully",
      data: applicantCvData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// get applicant cv data

const getAllApplicantCv = async (req, res) => {
  try {
    const allApplicantData = await applicantCvModel.find();
    if (!allApplicantData || allApplicantData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Application cv data is empty",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All application cv data retreived successfully",
      data: allApplicantData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// update applicant cv data

const updateApplicantCvData = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const {
      applicantName,
      personalInformation,
      education,
      languageSkills,
      computerSkills,
      trainingAndWorkshops,
      professionalMembership,
      experience,
      dutiesAndResponsibilities,
    } = req.body;

    // Fetch existing applicant data
    const applicantData = await applicantCvModel.findById(id);
    if (!applicantData) {
      return res.status(404).json({
        success: false,
        message: "Application CV data not found with this ID",
      });
    }

    // Update applicant name
    applicantData.applicantName = applicantName || applicantData.applicantName;

    // Update personal information
    if (personalInformation) {
      const keysToUpdate = [
        'place', 'nationality', 'dob', 'gender', 'maritalStatus',
        'email', 'currentAddress', 'permanentAddress', 'phone', 'expectedSalary'
      ];
      keysToUpdate.forEach(key => {
        applicantData.personalInformation[key] = personalInformation[key] || applicantData.personalInformation[key];
      });
    }

    // Handle profile image update
    if (req.files && req.files['profileImage']) {
      const profileImageFile = req.files['profileImage'][0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      
      if (!allowedTypes.includes(profileImageFile.mimetype)) {
        return res.status(400).json({ message: 'Invalid profile image type. Allowed types are: JPEG, PNG, GIF.' });
      }
      applicantData.personalInformation.profileImage = profileImageFile.filename;
    }

    // Update education
    if (education) {
      const educationKeys = ['degree', 'major', 'university', 'city', 'country', 'graduationMonth', 'graduationYear'];
      educationKeys.forEach(key => {
        applicantData.education[key] = education[key] || applicantData.education[key];
      });
    }

    // Update language skills
    if (languageSkills) {
      applicantData.languageSkills = languageSkills.map(newSkill => {
        const existingSkill = applicantData.languageSkills.find(skill => skill.name === newSkill.name);
        return existingSkill ? { ...existingSkill, fluencyLevel: newSkill.fluencyLevel || existingSkill.fluencyLevel } : newSkill;
      });
    }

    // Update computer skills and duties
    applicantData.computerSkills = computerSkills || applicantData.computerSkills;
    applicantData.dutiesAndResponsibilities = dutiesAndResponsibilities || applicantData.dutiesAndResponsibilities;

    // Update training and workshops
    if (trainingAndWorkshops) {
      applicantData.trainingAndWorkshops = trainingAndWorkshops.map(newTraining => {
        const existingTraining = applicantData.trainingAndWorkshops.find(training => training.nameOfTraining === newTraining.nameOfTraining);
        return existingTraining ? { ...existingTraining, ...newTraining } : newTraining;
      });
    }

    // Update professional membership
    if (professionalMembership) {
      applicantData.professionalMembership = professionalMembership.map(newMembership => {
        const existingMembership = applicantData.professionalMembership.find(membership => membership.institueName === newMembership.institueName);
        return existingMembership ? { ...existingMembership, yearOfMembership: newMembership.yearOfMembership || existingMembership.yearOfMembership } : newMembership;
      });
    }

    // Update experience
    if (experience) {                      
      const updatedExperience = experience.map((newExp, index) => {
        const existingExp = applicantData.experience.find(exp => exp.positionName === newExp.positionName);
        const logoFileKey = `logo[${index}]`;
        const logoFile = req.files && req.files[logoFileKey] ? req.files[logoFileKey][0] : null;

        if (existingExp) {
          return {
            ...existingExp,
            employerName: newExp.employerName || existingExp.employerName,
            speciality: newExp.speciality || existingExp.speciality,
            employerWebsite: newExp.employerWebsite || existingExp.employerWebsite,
            fromMonth: newExp.fromMonth || existingExp.fromMonth,
            toMonth: newExp.toMonth || existingExp.toMonth,
            logo: logoFile ? logoFile.filename : existingExp.logo
          };
        }

        return {
          ...newExp,
          logo: logoFile ? logoFile.filename : newExp.logo
        };
      });

      const existingExperience = applicantData.experience.filter(exp => 
        !experience.find(newExp => newExp.positionName === exp.positionName)
      );

      applicantData.experience = [...updatedExperience, ...existingExperience];
    }

    await applicantData.save();

    return res.status(200).json({
      success: true,
      message: "Applicant CV data updated successfully",
      data: applicantData,
    });

  } catch (error) {
    console.error("Error updating applicant CV data:", error); // Log the error for debugging
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// delete applicant cv data

const deleteApplicantCvData = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const deletedData = await applicantCvModel.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(400).json({
        success: false,
        message: "applicant cv data not found with this id",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Applican cv data deleted successfully",
      data: deletedData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// cms post and update data (banner , about , footer)

const createAndUpdateCmsData = async(req,res)=>{
  try {
    const {bannerTitle,bannerDescription,aboutTitle,aboutDescription,footerTitle,footerDescription} = req.body
    // console.log(bannerTitle)
    // console.log(typeof req.files.bannerImage)

    // if(!bannerTitle){
    //   return res.status(400).json({
    //     success : false,
    //     message : "Banner title is required"
    //   })
    // }
    // if(!bannerDescription){
    //   return res.status(400).json({
    //     success : false,
    //     message : "Banner description is required"
    //   })
    // }
    
    // if(!aboutTitle){
    //   return res.status(400).json({
    //     success : false,
    //     message : "About Title is required"
    //   })
    // }
    // if(!aboutDescription){
    //   return res.status(400).json({
    //     success : false,
    //     message : "About description is required"
    //   })
    // }

    // if(!footerTitle){
    //   return res.status(400).json({
    //     success : false,
    //     message : "Footer Title is required"
    //   })
    // }
    // if(!footerDescription){
    //   return res.status(400).json({
    //     success : false,
    //     message : "Footer description is required"
    //   })
    // }
    const allowedTypes = ["image/jpeg","image/jpg" ,"image/png", "image/gif"];

    let bImage = null
    let aImage = null
    let fImage = null

      if(req.files.bannerImage){
        if(!allowedTypes.includes(req.files.bannerImage[0].mimetype)){
          return res
        .status(400)
        .json({
          message:
            "Invalid banner image type. Allowed types are: JPEG,JPG, PNG, GIF.",
        });
        }
        bImage = req.files.bannerImage[0].filename
        console.log(bImage);
        
      }

      if(req.files.aboutImage){
        if(!allowedTypes.includes(req.files.aboutImage[0].mimetype)){
          return res
        .status(400)
        .json({
          message:
            "Invalid about image type. Allowed types are: JPEG,JPG, PNG, GIF.",
        });
        }
        aImage = req.files.aboutImage[0].filename
        console.log(aImage);

      }
      if(req.files.footerImage){
        if(!allowedTypes.includes(req.files.footerImage[0].mimetype)){
          return res
        .status(400)
        .json({
          message:
            "Invalid footer image type. Allowed types are: JPEG,JPG, PNG, GIF.",
        });
        }
        fImage = req.files.footerImage[0].filename
        console.log(fImage)
      }
  
      if(bannerTitle && bannerDescription){
        const bannerData = {
          bannerTitle,
          bannerDescription,
          bannerImage : bImage
        }
        await bannerModel.findOneAndUpdate({},bannerData,{upsert:true})
      }
      if(aboutTitle && aboutDescription){
        const aboutData = {
          aboutTitle,
          aboutDescription,
          aboutImage : aImage
        }
        await aboutModel.findOneAndUpdate({},aboutData,{upsert:true})
      }
      if(footerTitle && footerDescription){
        const footerData = {
          footerTitle,
          footerDescription,
          footerImage : fImage
        }
        await footerModel.findOneAndUpdate({},footerData,{upsert:true})
      }

    
    return res.status(200).json({
      success : true,
      message : "CMS data updated successfully"
    })


  } catch (error) {
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message
    })
  }
}

// get cms data (banner, about , footer)

const getCmsData = async(req,res)=>{
  try {
    const bannerData = await bannerModel.find()
    const aboutData = await aboutModel.find()
    const footerData = await footerModel.find()
    

    // if(bannerData.length === 0 && aboutData.length ===0 && footerData.length===0){
    //   return res.status(400).json({
    //     success : false,
    //     message : "Data of all models are empty",
        
    //   })
    // }

    return res.status(200).json({
      success : true,
      message :"All data retrieved successfully",
      data : {
        banner :bannerData ,
        about : aboutData ,
        footer : footerData
      }
    })

  } catch (error) {
    return res.status(500).json({
      success : false,
      message: "Internal Server Error",
      error : error.message
    })
  }
}

module.exports = {
  createJobVacancy,
  getAllJobVacancies,
  getJobVacancyById,
  updateJobVacancyById,
  deleteJobVacancyData,
  addTrainingCourse,
  getAllTrainingCourses,
  getSingleTrainingCourseById,
  updateTrainingCourseData,
  deleteTrainingCourseData,
  createHrArticle,
  getAllHrAticles,
  getHrArticleById,
  updateHrArticleDataById,
  deleteHrArticleDataById,
  createLatestActivity,
  getAllLatestActivities,
  getLatestActivityById,
  updateLatestActivityDataById,
  deleteLatestActivityDataById,
  createClient,
  getClientDataById,
  updateClientDataById,
  deleteClientDataById,
  clientLogin,
  changePassword,
  generateOtp,
  verifyOtp,
  resetPassword,
  createRegistration,
  getAllTrainingRegistration,
  getTrainingRegistrationById,
  updateTrainingRegistration,
  deleteTrainingRegistration,
  createTrainingRequest,
  getAllTrainingRequest,
  getTrainingRequestById,
  updateTrainingRequest,
  deleteTrainingRequest,
  createTrainerRegistration,
  getAllTrainerRegistrations,
  getTrainerRegistrationById,
  updateTrainerRegistration,
  deleteTrainerRegistration,
  createUser,
  getUserDataById,
  updateUserDataById,
  deleteUserDataById,
  userLogin,
  change_password,
  generate_otp,
  verify_otp,
  reset_password,
  createContactUs,
  getAllContactUs,
  createCvSubmit,
  getCvSubmit,
  getAllClientData,
  updateCvSubmitById,
  deleteCvSubmitById,
  createApplicantCv,
  getAllApplicantCv,
  updateApplicantCvData,
  deleteApplicantCvData,
  createAndUpdateCmsData,
  getCmsData
};

